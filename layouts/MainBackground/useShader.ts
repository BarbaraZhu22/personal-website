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

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader for light theme (Gardner textured ellipsoid clouds)
export const cloudFragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColor1; // Cloud color (bright)
  uniform vec3 uColor2; // Shadow color (darker)
  uniform vec2 uCloudPosition; // Cloud center position (animated)
  uniform int uNumSteps; // Number of color steps for cloud rendering

  varying vec2 vUv;

  float hash( float n ) {
    return fract(sin(n)*43758.5453);
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
    
    // Cloud center (animated position)
    vec2 cloudCenter = uCloudPosition;
    
    // Cloud size as ratio of plane size (80% coverage)
    float cloudSizeRatio = 0.8;
    vec2 cloudSize = vec2(cloudSizeRatio, cloudSizeRatio * 0.7); // Oblong shape
    
    // Create noise cloud using 2D Perlin noise method
    float cloudDensity = createNoiseCloud(uv, cloudCenter, cloudSize);
    
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
    vec3 brightColor = uColor1;
    
    // Use density directly as alpha
    float cloudAlpha = cloudDensity;
    cloudAlpha = pow(cloudAlpha, 0.8); // Apply sharpening for better contrast
    cloudAlpha = clamp(cloudAlpha, 0.0, 1.0);
    
    // Normalize density to 0.0-1.0 range (all densities use same logic)
    float normalizedDensity = cloudDensity;
    
    // Create stepped color bands for natural layer transitions
    int NUM_STEPS = uNumSteps;      // Number of color steps (from uniform)
    
    // Apply stepping DIRECTLY to normalized density FIRST to create distinct layers
    float stepIndex = floor(normalizedDensity * float(NUM_STEPS));
    stepIndex = clamp(stepIndex, 0.0, float(NUM_STEPS - 1));
    
    // Normalize step index to 0.0-1.0 range (this creates discrete steps matching NUM_STEPS)
    float steppedDensity = stepIndex / float(NUM_STEPS - 1);
    
    // Use stepped density directly for color mixing (preserves all steps)
    float mixFactor = steppedDensity; // Direct mapping ensures all steps are visible
    
    // Apply stepped effect again to ensure absolute distinctness
    float stepMixFactor = floor(mixFactor * float(NUM_STEPS)) / float(NUM_STEPS - 1);
    
    // Very minimal smoothing to preserve step visibility (almost pure stepped)
    float smoothBlend = 0.0; // Pure stepped = all layers visible
    mixFactor = mix(stepMixFactor, mixFactor, smoothBlend);
    
    // Apply final sharpening (higher power = more contrast between layers)
    float sharpDensity = pow(mixFactor, 0.95); // Very high power = very sharp transitions
    
    // Mix shadow (base) and white using natural transitions
    vec3 cloudColor = mix(shadowColor, brightColor, sharpDensity);
    
    // Ensure color values are clamped between 0.0 and 1.0
    cloudColor = clamp(cloudColor, 0.0, 1.0);
        
    // Set final color and alpha
    vec3 finalColor = cloudColor;
    
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
  uniform vec3 uHaloColor;
  uniform float uOpacity;
  uniform float uStarDensity;
  uniform float uStarSize;
  uniform float uNoiseSeed;

  varying vec2 vUv;

  // Hash function for noise
  float hash(float n) {
    return fract(sin(n) * 43758.5453);
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

  // Fractal Brownian Motion for 2D Perlin noise with seed
  float fbm2D(vec2 p, float seed) {
    float value = 0.0;
    float amplitude = 0.9;
    float frequency = 1.0 * seed; // Multiply frequency by seed
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

  // Discrete FBM noise - outputs 0 or 1 only
  float discreteFbm2D(vec2 p, float seed) {
    float noiseValue = fbm2D(p, seed);
    // Lower threshold to get more stars (more 1 values)
    float threshold = 0.35;
    return step(threshold, noiseValue);
  }

  // Helper function to create a star layer - returns core and halo separately
  void createStarLayer(vec2 uv, float densityScale, float seed, bool useVariation, out float coreOut, out float haloOut) {
    vec2 noiseUV = uv * densityScale;
    
    // Get grid position and fractional part for distance calculation
    vec2 grid = floor(noiseUV);
    vec2 gridUV = fract(noiseUV) - 0.5;
    
    // Sample discrete FBM noise with seed
    float centerValue = discreteFbm2D(grid, seed);
    
    // Check neighbors
    float neighbor1 = discreteFbm2D(grid + vec2(1.0, 0.0), seed);
    float neighbor2 = discreteFbm2D(grid + vec2(-1.0, 0.0), seed);
    float neighbor3 = discreteFbm2D(grid + vec2(0.0, 1.0), seed);
    float neighbor4 = discreteFbm2D(grid + vec2(0.0, -1.0), seed);
    
    float neighborSum = neighbor1 + neighbor2 + neighbor3 + neighbor4;
    float starExists = centerValue * step(neighborSum, 2.0);
    
    // Calculate distance
    float distance = length(gridUV);
    
    // Size and brightness variation (only for random layer)
    float sizeVariation = 1.0;
    float brightnessVariation = 1.0;
    
    if (useVariation) {
      // Generate size variation (0.8-1.3)
      vec2 sizeNoiseUV = grid + vec2(200.0);
      float sizeNoise = noise2D(sizeNoiseUV);
      sizeVariation = 0.8 + sizeNoise * 0.5;
      
      // Generate brightness variation (0.5-1.0)
      vec2 brightnessNoiseUV = grid + vec2(300.0);
      float brightnessNoise = noise2D(brightnessNoiseUV);
      brightnessVariation = 0.5 + brightnessNoise * 0.5;
    }
    
    // Create star shape with size variation
    float sizeFactor = uStarSize / 10.0 * sizeVariation;
    
    float baseCoreRadius = 0.04;
    float coreRadius = baseCoreRadius * sizeFactor;
    float core = smoothstep(coreRadius, 0.0, distance);
    
    // Halo should be larger than core - creates soft glow around the core
    float baseHaloRadius = 0.05;
    float haloRadius = baseHaloRadius * sizeFactor;
    // Halo only appears between core and halo radius (ring around core)
    float halo = smoothstep(haloRadius, coreRadius, distance);
    // Remove halo where core is (core already handles that area)
    halo *= step(coreRadius, distance);
    
    // Add twinkling effect
    float twinklePhase = noise2D(grid + vec2(100.0)) * 5.0;
    float twinkleSpeed = 1.5 + noise2D(grid + vec2(150.0)) * 0.5;
    float twinkle = sin(uTime * twinkleSpeed + twinklePhase) * 0.15 + 0.85;
    
    // Apply star existence, brightness variation and twinkle
    coreOut = starExists * core * brightnessVariation * twinkle;
    haloOut = starExists * halo * brightnessVariation * twinkle;
  }

  void main() {
    vec2 uv = vUv;
    
    // Density (0-1) controls the density scale directly
    float baseDensityScale = 120.0;
    float densityScale = baseDensityScale * uStarDensity;
    
    // Layer 1: Stable layer (seed = 1.0, no variation)
    float stableCore, stableHalo;
    createStarLayer(uv, densityScale, 1.0, false, stableCore, stableHalo);
    
    // Layer 2: Random layer (uses uNoiseSeed for different distribution, with variation)
    vec2 randomUV = uv + vec2(50.0, 50.0);
    float randomCore, randomHalo;
    createStarLayer(randomUV, densityScale, uNoiseSeed, true, randomCore, randomHalo);
    
    // Combine both layers
    float totalCore = stableCore + randomCore;
    float totalHalo = stableHalo + randomHalo;
    
    // Use star color for core, halo color for halo
    vec3 coreColor = uStarColor * totalCore;
    
    // Lighten halo color by mixing with white and reduce opacity for more natural look
    vec3 lightenedHaloColor = mix(uStarColor, uHaloColor, 0.3); // Mix 70% white, 30% theme color
    vec3 haloColor = lightenedHaloColor * totalHalo * 0.06; // Very subtle opacity
    
    // Combine colors
    vec3 color = coreColor + haloColor;
    
    // Apply opacity - core contributes more, halo much less
    float alpha = uOpacity * (totalCore + totalHalo * 0.15);
    
    gl_FragColor = vec4(color, alpha);
  }
`;
