// Noise function for cloud effect (light theme)
export const createNoiseCloud = `// Create noise cloud using 2D Perlin noise method
  // Returns cloud density value between 0.0 and 1.0
  float createNoiseCloud(vec2 uv, vec2 center, vec2 cloudSize) {
    // Create oblong shape (ellipse)
    vec2 dist = (uv - center) / cloudSize;
    float ellipseDist = length(vec2(dist.x * 1.2, dist.y * 0.8)); // Oblong shape
    
    // Create elliptical falloff mask
    float ellipseMask = smoothstep(1.0, 0.4, ellipseDist);
    
    // Use 2D Perlin noise to create cloud texture
    vec2 noisePos = uv * 3.5 + vec2(10.0) + uTime * 0.02;
    float noise = fbm2D(noisePos);
    
    // Normalize noise to 0.0-1.0 range (already done in fbm2D, but ensure it)
    noise = clamp(noise, 0.0, 1.0);
    
    // Enhance noise contrast for better cloud definition
    // Lower power = more variation in density
    noise = pow(noise, 0.75);
    
    // Boost noise values to create more high-density areas
    noise = noise * 1.15;
    noise = clamp(noise, 0.0, 1.0);
    
    // Combine ellipse shape with noise
    float cloudDensity = ellipseMask * noise;
    
    // Apply additional falloff for smoother edges
    cloudDensity *= smoothstep(1.0, 0.5, ellipseDist);
    
    // Enhance density variation for clearer white/shadow distinction
    cloudDensity = pow(cloudDensity, 0.9);
    
    // Ensure final value is between 0.0 and 1.0
    return clamp(cloudDensity, 0.0, 1.0);
  }`;

// Vertex shader (shared for both themes)
export const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader for light theme (Gardner textured ellipsoid clouds)
export const cloudFragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColor1; // Cloud color (bright)
  uniform vec3 uColor2; // Shadow color (darker)
  uniform float uOpacity;

  varying vec2 vUv;
  varying vec3 vPosition;

  // Gardner cloud parameters
  vec3 R = vec3(1., 2., 1.);              // ellipsoid radius
  vec3 L = normalize(vec3(-0.4, 0.3, 1.)); // light source direction
  const float AMBIENT = 0.4;              // ambient luminosity

  const float PI = 3.1415927;

  // Noise matrix
  mat3 m = mat3( 0.00,  0.80,  0.60,
                -0.80,  0.36, -0.48,
                -0.60, -0.48,  0.64 );

  float hash( float n ) {
    return fract(sin(n)*43758.5453);
  }

  float noise( in vec3 x ) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0 + 113.0*p.z;
    float res = mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                        mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
                    mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                        mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
    return res;
  }

  float fbm( vec3 p ) {
    p += uTime * 0.05;
    float f;
    f  = 0.5000*noise( p ); p = m*p*2.02;
    f += 0.2500*noise( p ); p = m*p*2.03;
    f += 0.1250*noise( p ); p = m*p*2.01;
    f += 0.0625*noise( p );
    return f;
  }

  float snoise( in vec3 x ) {
    return 2.*noise(x)-1.;
  }

  float sfbm( vec3 p ) {
    p += uTime * 0.05;
    float f;
    f  = 0.5000*snoise( p ); p = m*p*2.02;
    f += 0.2500*snoise( p ); p = m*p*2.03;
    f += 0.1250*snoise( p ); p = m*p*2.01;
    f += 0.0625*snoise( p );
    return f;
  }

  // 2D Perlin noise function
  float noise2D(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = hash(i.x + i.y * 57.0);
    float b = hash(i.x + 1.0 + i.y * 57.0);
    float c = hash(i.x + (i.y + 1.0) * 57.0);
    float d = hash(i.x + 1.0 + (i.y + 1.0) * 57.0);
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  // Fractal Brownian Motion for 2D Perlin noise
  float fbm2D(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    float amplitudeSum = 0.0;
    
    for (int i = 0; i < 4; i++) {
      float amp = amplitude;
      value += amp * noise2D(p * frequency);
      amplitudeSum += amp;
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    
    // Normalize to 0.0-1.0 range
    return clamp(value / amplitudeSum, 0.0, 1.0);
  }
  
  
    ${createNoiseCloud}

  void main() {
    vec2 uv = vUv;
    
    //  Background Color    
    vec3 finalColor = vec3(0.0, 0.0, 0.0);
    
    // Cloud center (center of screen)
    vec2 cloudCenter = vec2(0.5, 0.5);
    
    // Cloud size as ratio of plane size (larger for better visibility)
    float cloudSizeRatio = 0.5;
    vec2 cloudSize = vec2(cloudSizeRatio, cloudSizeRatio * 0.7); // Oblong shape
    
    // Create noise cloud using 2D Perlin noise method
    float cloudDensity = createNoiseCloud(uv, cloudCenter, cloudSize);
    
    // Calculate lighting for cloud (simple gradient from top-left)
    vec2 toLight = cloudCenter - uv;
    float lightIntensity = dot(normalize(toLight), normalize(vec2(-0.5, 0.5)));
    lightIntensity = (lightIntensity + 1.0) * 0.5; // Normalize to 0-1
    lightIntensity = smoothstep(0.2, 0.9, lightIntensity); // Improved contrast curve
    
    // ============================================================================
    // UNIFIED DENSITY-TO-COLOR MAPPING WITH NATURAL TRANSITIONS
    // ============================================================================
    // Single Zone System: All densities use natural stepped transitions
    // 
    // Formula: 
    //   - All densities go through stepped color bands
    //   - Shadow color is the base (default)
    //   - Natural transitions between layers using smoothstep
    //   - alpha = cloudDensity (direct mapping)
    // ============================================================================
    
    // Base colors - shadow color is the base
    vec3 shadowColor = uColor2;
    vec3 whiteColor = vec3(1.0, 1.0, 1.0);
    
    // Use density directly as alpha
    float cloudAlpha = cloudDensity;
    cloudAlpha = pow(cloudAlpha, 0.8); // Apply sharpening for better contrast
    cloudAlpha = clamp(cloudAlpha, 0.0, 1.0);
    
    // Normalize density to 0.0-1.0 range (all densities use same logic)
    float normalizedDensity = cloudDensity;
    
    // Create stepped color bands for natural layer transitions
    // Formula: step_count = floor(normalized_density / step_size)
    const float STEP_SIZE = 0.05;  // Change color every 0.05
    const int NUM_STEPS = 18;      // Number of color steps
    
    // Calculate which step we're in (0 to NUM_STEPS-1)
    float stepIndex = floor(normalizedDensity * float(NUM_STEPS));
    stepIndex = clamp(stepIndex, 0.0, float(NUM_STEPS - 1));
    
    // Normalize step index to 0.0-1.0 for mixing
    float stepNormalized = stepIndex / float(NUM_STEPS - 1);
    
    // Apply bias based on normalized density:
    // - Below 0.5: More shadow color (slower transition to white)
    // - Above 0.5: More cloud color/white (faster transition to white)
    float mixFactor;
    
    if (normalizedDensity < 0.5) {
      // Below 0.5: Bias towards shadow color
      mixFactor = normalizedDensity * 0.8; // Range: 0.0 to 0.4
    } else {
      // Above 0.5: Bias towards cloud color (white)
      float aboveHalf = (normalizedDensity - 0.5) / 0.5; // 0.0 to 1.0
      mixFactor = 0.4 + aboveHalf * 0.6; // Range: 0.4 to 1.0
    }
    
    // Apply stepped effect with natural smooth transitions
    // Quantize mixFactor to steps
    float stepMixFactor = floor(mixFactor * float(NUM_STEPS)) / float(NUM_STEPS - 1);
    
    // Blend step and smooth for natural transitions (increase smoothness)
    float smoothBlend = 0.6; // More smooth = more natural transitions
    mixFactor = mix(stepMixFactor, mixFactor, smoothBlend);
    
    // Apply natural easing using smoothstep for smoother transitions
    mixFactor = smoothstep(0.0, 1.0, mixFactor);
    
    // Apply final sharpening
    float sharpDensity = pow(mixFactor, 0.7);
    
    // Mix shadow (base) and white using natural transitions
    vec3 cloudColor = mix(shadowColor, whiteColor, sharpDensity);
    
    // Ensure color values are clamped between 0.0 and 1.0
    cloudColor = clamp(cloudColor, 0.0, 1.0);
    
    // Add highlight color (uColor1) on top layer only (high density areas)
    if (normalizedDensity > 0.9) {
      cloudColor += uColor1;
    }
    
    // Clamp again after adding highlight
    cloudColor = clamp(cloudColor, 0.0, 1.0);
    
    // Set final color and alpha
    finalColor = cloudColor;
    
    // Apply overall opacity with cloud alpha
    float alpha = cloudAlpha;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// Fragment shader for dark theme (star night)
export const starFragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uStarColor;
  uniform float uOpacity;
  uniform float uStarDensity;

  varying vec2 vUv;
  varying vec3 vPosition;

  // Random function
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  // Star field function
  float stars(vec2 uv, float density) {
    vec2 grid = floor(uv * density);
    vec2 gridUV = fract(uv * density) - 0.5;
    
    float star = random(grid);
    float distance = length(gridUV);
    
    // Create star shape
    float starShape = smoothstep(0.5, 0.0, distance) * step(0.9, star);
    
    // Add twinkling effect
    float twinkle = sin(uTime * 2.0 + random(grid) * 10.0) * 0.5 + 0.5;
    
    return starShape * twinkle;
  }

  void main() {
    vec2 uv = vUv;
    
    // Create star field
    float starField = stars(uv, uStarDensity);
    
    // Add multiple layers for depth
    float layer1 = stars(uv * 0.7, uStarDensity * 0.8);
    float layer2 = stars(uv * 0.5, uStarDensity * 0.6);
    
    float totalStars = starField + layer1 * 0.5 + layer2 * 0.3;
    
    // Apply opacity - areas without stars should be more transparent
    float alpha = uOpacity * (0.1 + totalStars * 0.9);
    
    // Create color with slight blue tint
    vec3 color = uStarColor * totalStars;
    
    gl_FragColor = vec4(color, alpha);
  }
`;
