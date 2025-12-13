"use client"

import { useRef, useState, useMemo, useEffect, useCallback } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { textureLoader } from "../utils/textureLoader"

// Import planet textures
import mercuryTex from "../assests/textures/planets/mercury_color.jpg"
import venusTex from "../assests/textures/planets/venus_color.jpg"
import earthTex from "../assests/textures/planets/earth_color.jpg"
import marsTex from "../assests/textures/planets/mars_color.jpg"
import jupiterTex from "../assests/textures/planets/jupiter_color.jpg"
import saturnTex from "../assests/textures/planets/saturn_color.jpg"
import uranusTex from "../assests/textures/planets/uranus_color.jpg"
import neptuneTex from "../assests/textures/planets/neptune_color.jpg"
import plutoTex from "../assests/textures/planets/pluto_color.jpg"

const planetTextureMap = {
  1: mercuryTex,
  2: venusTex,
  3: earthTex,
  4: marsTex,
  5: jupiterTex,
  6: saturnTex,
  7: uranusTex,
  8: neptuneTex,
  9: plutoTex,
}

const fallbackColors = {
  1: "#8c7853",
  2: "#ff8c42",
  3: "#1e90ff",
  4: "#cd5c5c",
  5: "#d4a017",
  6: "#f0e68c",
  7: "#afeeee",
  8: "#4169e1",
  9: "#c0c0c0",
}

const planetGlowColors = {
  1: "#ffd700",
  2: "#ffb347",
  3: "#7ec8e3",
  4: "#ff6b6b",
  5: "#ffd93d",
  6: "#fffacd",
  7: "#b0e0e6",
  8: "#6495ed",
  9: "#d3d3d3",
}

const planetSizes = {
  rocky: 1.0,
  volcanic: 0.8,
  ocean: 1.0,
  rusty: 0.7,
  "gas-giant": 1.8,
  "ringed-gas": 1.5,
  "ice-giant": 1.3,
  "ocean-giant": 1.3,
  dwarf: 1.2,
}

const eccentricities = [0.206, 0.007, 0.017, 0.093, 0.048, 0.056, 0.046, 0.009, 0.249]
const inclinations = [0.035, 0.059, 0, 0.032, 0.023, 0.043, 0.013, 0.03, 0.115]

// Create planet texture with black outline
const createPlanetTexture = (color, type) => {
  const canvas = document.createElement("canvas")
  canvas.width = 512
  canvas.height = 512
  const context = canvas.getContext("2d")
  
  // Brighten the base color
  const brightenedColor = new THREE.Color(color).multiplyScalar(1.4).getStyle()
  
  // Create base color with subtle gradient
  const gradient = context.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 0,
    canvas.width / 2, canvas.height / 2, canvas.width / 2
  )
  gradient.addColorStop(0, brightenedColor)
  gradient.addColorStop(1, new THREE.Color(brightenedColor).multiplyScalar(0.85).getStyle())
  
  context.fillStyle = gradient
  context.fillRect(0, 0, canvas.width, canvas.height)

  const patterns = {
    "gas-giant": () => {
      for (let i = 0; i < 8; i++) {
        context.fillStyle = `rgba(255,255,255,${0.15 + Math.random() * 0.2})`
        context.fillRect(0, i * 64, canvas.width, 20 + Math.random() * 30)
      }
    },
    ocean: () => {
      context.fillStyle = "rgba(50, 150, 50, 0.6)"
      for (let i = 0; i < 5; i++) {
        context.beginPath()
        context.arc(100 + Math.random() * 312, 100 + Math.random() * 312, 30 + Math.random() * 40, 0, Math.PI * 2)
        context.fill()
      }
    },
    rocky: () => {
      context.fillStyle = "rgba(30,30,30,0.4)"
      for (let i = 0; i < 15; i++) {
        context.beginPath()
        context.arc(Math.random() * 512, Math.random() * 512, 5 + Math.random() * 15, 0, Math.PI * 2)
        context.fill()
      }
    },
    "ice-giant": () => {
      context.fillStyle = "rgba(255,255,255,0.3)"
      for (let i = 0; i < 20; i++) {
        context.beginPath()
        context.arc(Math.random() * 512, Math.random() * 512, 10 + Math.random() * 20, 0, Math.PI * 2)
        context.fill()
      }
    },
  }
  ;(patterns[type] || patterns["rocky"])()
  
  // Add black outline
  context.strokeStyle = "#000000"
  context.lineWidth = 8
  context.beginPath()
  context.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 4, 0, Math.PI * 2)
  context.stroke()
  
  // Add subtle inner rim highlight for 3D effect
  context.strokeStyle = "rgba(255,255,255,0.3)"
  context.lineWidth = 3
  context.beginPath()
  context.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 6, 0, Math.PI * 2)
  context.stroke()

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

const geometryCache = new Map()
const getOrCreateGeometry = (args, type = "sphere") => {
  const key = JSON.stringify(args)
  if (!geometryCache.has(key)) {
    geometryCache.set(key, type === "ring" ? new THREE.RingGeometry(...args) : new THREE.SphereGeometry(...args))
  }
  return geometryCache.get(key)
}

// Star Field - FIXED: No transparency issues
const StarField = ({ count = 10000 }) => {
  const pointsRef = useRef()
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i += 3) {
      // Create stars at VERY large distances to prevent fading
      const radius = 5000 + Math.random() * 50000
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      pos[i] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i + 1] = radius * Math.sin(phi) * Math.sin(theta)
      pos[i + 2] = radius * Math.cos(phi)
    }
    return pos
  }, [count])

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        sizeAttenuation={true}
        color={0xffffff}
        transparent={false} // SOLID stars
        opacity={1} // Full opacity
      />
    </points>
  )
}

// Simple Galaxy for when zoomed out
const Galaxy = ({ visible = true }) => {
  const galaxyRef = useRef()
  
  const positions = useMemo(() => {
    const pos = new Float32Array(20000 * 3)
    for (let i = 0; i < 20000 * 3; i += 3) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() ** 2 * 2000
      const height = (Math.random() - 0.5) * 50
      
      const spiralAngle = angle + radius * 0.05
      const armRadius = radius * (0.8 + Math.sin(spiralAngle * 2) * 0.2)
      
      pos[i] = Math.cos(angle) * armRadius
      pos[i + 1] = height
      pos[i + 2] = Math.sin(angle) * armRadius
    }
    return pos
  }, [])

  useFrame(() => {
    if (galaxyRef.current && visible) {
      galaxyRef.current.rotation.y += 0.00005
    }
  })

  if (!visible) return null

  return (
    <points ref={galaxyRef} position={[0, 0, -10000]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={20000}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        sizeAttenuation={true}
        color={0x88aaff}
        transparent={false}
        opacity={0.7}
      />
    </points>
  )
}

const ProjectPlanet = ({
  project,
  onSelect,
  index = 0,
  orbitalPeriod = 30,
  orbitalDistance = 10,
}) => {
  const meshRef = useRef()
  const groupRef = useRef()
  const outlineRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [texture, setTexture] = useState(null)
  const generatedTextureRef = useRef(null)
  const pulseRef = useRef(0)

  const safeProject = project || { id: 1, color: "#666666", planetType: "rocky", rings: false, atmosphere: false }

  const { planetSize, planetColor } = useMemo(
    () => ({
      planetSize: planetSizes[safeProject.planetType] || 0.5,
      planetColor: fallbackColors[safeProject.id] || safeProject.color || "#666666",
    }),
    [safeProject.id, safeProject.planetType, safeProject.color],
  )

  const { orbitRadius, initialAngle, eccentricity, inclination } = useMemo(
    () => ({
      orbitRadius: orbitalDistance,
      initialAngle: Math.random() * Math.PI * 2,
      eccentricity: eccentricities[index] || 0.1,
      inclination: inclinations[index] || 0,
    }),
    [orbitalDistance, index],
  )

  // Orbit path geometry
  const orbitPathGeometry = useMemo(() => {
    const points = []
    const segments = 64

    const cosI = Math.cos(inclination)
    const sinI = Math.sin(inclination)
    
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      const currentDistance = orbitRadius * (1 - eccentricity * Math.cos(angle))

      const x = Math.cos(angle) * currentDistance
      const z0 = Math.sin(angle) * currentDistance

      // Tilt the orbital plane by rotating around the X-axis
      const y = -z0 * sinI
      const z = z0 * cosI
      
      points.push(new THREE.Vector3(x, y, z))
    }
    
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [orbitRadius, eccentricity, inclination])

  // Main planet material - slightly stronger internal glow
  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      map: texture,
      color: texture ? 0xffffff : planetColor,
      roughness: 0.9,
      metalness: 0.0,
      emissive: new THREE.Color(planetColor),
      emissiveIntensity: 0.18,
      transparent: false,
      opacity: 1,
    })
    return mat
  }, [texture, planetColor])

  // Remove outline usage: keep material defined only if needed elsewhere
  // Thin black border by rendering a slightly larger back-face sphere
  const outlineMaterial = useMemo(() => {
    const mat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.BackSide,
      transparent: false,
      opacity: 1,
    })
    return mat
  }, [])

  // Remove glow overlay entirely
  const glowMaterial = useMemo(() => new THREE.MeshBasicMaterial({ visible: false }), [])

  // Remove separate atmosphere overlay to avoid washing out texture
  const atmosphereMaterial = useMemo(() => new THREE.MeshBasicMaterial({ visible: false }), [])

  const sphereGeom = useMemo(() => getOrCreateGeometry([planetSize, 32, 32]), [planetSize])
  const outlineGeom = useMemo(() => getOrCreateGeometry([planetSize * 1.06, 32, 32]), [planetSize])
  const glowGeom = useMemo(() => getOrCreateGeometry([planetSize * 1.2, 32, 32]), [planetSize]) // Closer glow
  const atmosphereGeom = useMemo(() => getOrCreateGeometry([planetSize * 1.1, 32, 32]), [planetSize])
  const ringGeom = useMemo(() => getOrCreateGeometry([planetSize * 1.8, planetSize * 2.5, 32], "ring"), [planetSize])

  useEffect(() => {
    let disposed = false
    if (generatedTextureRef.current) generatedTextureRef.current.dispose()

    const url = planetTextureMap[safeProject.id]
    const applyGeneratedFallback = () => {
      if (disposed) return
      const gen = createPlanetTexture(planetColor, safeProject.planetType)
      generatedTextureRef.current = gen
      setTexture(gen)
    }

    if (!url) {
      applyGeneratedFallback()
      return () => {
        disposed = true
        if (generatedTextureRef.current) generatedTextureRef.current.dispose()
      }
    }

    const load = async () => {
      try {
        const maybePromise = textureLoader.loadTexture(url, safeProject.id)
        const result = typeof maybePromise?.then === "function" ? await maybePromise : maybePromise
        if (disposed) return
        const tex = result?.texture ?? result
        if (tex instanceof THREE.Texture) {
          tex.colorSpace = THREE.SRGBColorSpace
          setTexture(tex)
        } else {
          applyGeneratedFallback()
        }
      } catch (e) {
        console.warn("Texture load error:", e)
        applyGeneratedFallback()
      }
    }

    load()
    return () => {
      disposed = true
      if (generatedTextureRef.current) generatedTextureRef.current.dispose()
    }
  }, [safeProject.id, safeProject.planetType, planetColor])

  const handlePointerOver = useCallback((e) => {
    e.stopPropagation()
    setHovered(true)
  }, [])
  const handlePointerOut = useCallback(() => setHovered(false), [])
  const handleClick = useCallback(
    (e) => {
      e.stopPropagation()
      onSelect?.(safeProject)
    },
    [onSelect, safeProject],
  )

  useFrame((state) => {
    // Update orbital position
    if (groupRef.current) {
      const time = state.clock.elapsedTime
      const angle = initialAngle + (time / orbitalPeriod) * Math.PI * 2
      const currentDistance = orbitRadius * (1 - eccentricity * Math.cos(angle))

      const x = Math.cos(angle) * currentDistance
      const z0 = Math.sin(angle) * currentDistance
      const cosI = Math.cos(inclination)
      const sinI = Math.sin(inclination)
      const y = -z0 * sinI
      const z = z0 * cosI

      groupRef.current.position.set(x, y, z)
    }

    // Planet rotation and scale
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      const targetScale = hovered ? 1.2 : 1.0
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }

    // Subtle pulsing effect when hovered
    if (hovered) {
      pulseRef.current += 0.1
      const pulseScale = 1 + Math.sin(pulseRef.current) * 0.05
      if (meshRef.current) {
        meshRef.current.scale.multiplyScalar(pulseScale / meshRef.current.scale.x)
      }
    }
  })

  return (
    <group ref={groupRef}>
      {/* Clean white orbit line - more subtle */}
      <line geometry={orbitPathGeometry}>
        <lineBasicMaterial
          color={0xffffff}
          transparent={true}
          opacity={0.16}
          linewidth={1}
        />
      </line>
      
      {/* Black border */}
      <mesh
        geometry={outlineGeom}
        material={outlineMaterial}
        frustumCulled={false}
      />
      
      {/* Main planet - solid textured sphere */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        frustumCulled={false}
        geometry={sphereGeom}
        material={material}
      />
      
      {/* Rings - with solid appearance */}
      {safeProject.rings && (
        <mesh rotation={[Math.PI / 2, 0, 0]} geometry={ringGeom}>
          <meshBasicMaterial 
            color={0xf0e68c} 
            transparent={false}
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {/* Atmosphere removed to keep textures crisp */}
    </group>
  )
}

// MAIN SOLAR SYSTEM - FIXED: No disappearing on zoom
const SolarSystem = ({ projects = [], onPlanetSelect }) => {
  const { camera, gl } = useThree()
  const zoomRef = useRef(0)
  const [showGalaxy, setShowGalaxy] = useState(false)
  const cameraTarget = useRef(new THREE.Vector3(0, 30, 50))
  
  // CRITICAL FIX: Setup camera with proper far plane
  useEffect(() => {
    // Set MASSIVE far plane - 1 million units
    camera.far = 1000000
    camera.near = 0.1
    camera.updateProjectionMatrix()
    
    // Disable automatic matrix updates for manual control
    camera.matrixAutoUpdate = true
    
    // Initial camera position
    camera.position.set(0, 30, 50)
    camera.lookAt(0, 0, 0)
    
    // Setup renderer
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    console.log("Camera initialized:", {
      far: camera.far,
      position: camera.position,
      fov: camera.fov
    })
    
    // Handle wheel zoom
    const handleWheel = (e) => {
      e.preventDefault()
      
      // Calculate zoom based on deltaY
      const zoomSpeed = 0.001
      zoomRef.current += e.deltaY * zoomSpeed
      zoomRef.current = Math.max(0, Math.min(1, zoomRef.current))
      
      // Show galaxy when zoomed out past 50%
      setShowGalaxy(zoomRef.current > 0.5)
      
      // Calculate new camera position based on zoom
      // This creates a smooth logarithmic zoom curve
      const zoomPower = Math.pow(10, zoomRef.current * 3) // 1 to 1000 scale
      const targetZ = 50 + zoomRef.current * 1000 // Max 1050 units out
      const targetY = 30 + zoomRef.current * 200 // Max 230 units up
      
      cameraTarget.current.z = targetZ
      cameraTarget.current.y = targetY
      
      console.log(`Zoom: ${zoomRef.current.toFixed(2)}, Camera Z: ${targetZ.toFixed(0)}`)
    }
    
    window.addEventListener('wheel', handleWheel, { passive: false })
    
    // Handle keyboard zoom for testing
    const handleKeyDown = (e) => {
      if (e.key === '=' || e.key === '+') {
        zoomRef.current = Math.min(1, zoomRef.current + 0.1)
        setShowGalaxy(zoomRef.current > 0.5)
        cameraTarget.current.z = 50 + zoomRef.current * 1000
        cameraTarget.current.y = 30 + zoomRef.current * 200
      } else if (e.key === '-' || e.key === '_') {
        zoomRef.current = Math.max(0, zoomRef.current - 0.1)
        setShowGalaxy(zoomRef.current > 0.5)
        cameraTarget.current.z = 50 + zoomRef.current * 1000
        cameraTarget.current.y = 30 + zoomRef.current * 200
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [camera, gl])
  
  // Smooth camera animation
  useFrame(() => {
    // Smoothly move camera to target
    camera.position.lerp(cameraTarget.current, 0.1)
    
    // Always look at center
    camera.lookAt(0, 0, 0)
    
    // Force camera matrix update
    camera.updateMatrixWorld()
  })
  
  return (
    <>
      {/* SOLID star field - never disappears */}
      <StarField count={15000} />
      
      {/* SOLID galaxy - only visible when zoomed out */}
      <Galaxy visible={showGalaxy} />
      
      {/* SOLID Sun with no transparency */}
      <pointLight 
        position={[0, 0, 0]} 
        intensity={2.5} 
        color={0xffd700} 
        distance={10000}
        decay={0} // No light decay over distance
      />
      
      <ambientLight intensity={0.3} color={0xffffff} />
      
      {/* Main Sun sphere - SOLID */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshBasicMaterial
          color={0xffd700}
          toneMapped={false}
          transparent={false}
          opacity={1}
        />
      </mesh>
      
      {/* Sun glow - SOLID (not transparent) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[4.5, 32, 32]} />
        <meshBasicMaterial
          color={0xffa500}
          transparent={false}
          opacity={0.5}
        />
      </mesh>
      
      {/* Additional directional light for planet visibility */}
      <directionalLight
        position={[100, 100, 50]}
        intensity={0.8}
        color={0xffffff}
      />
      
      {/* SOLID planets - they will NEVER disappear */}
      {projects.map((project, index) => {
        const orbitalDistance = 8 + index * 12
        const orbitalPeriod = 20 + index * 10
        
        return (
          <ProjectPlanet
            key={project.id || index}
            project={project}
            index={index}
            orbitalDistance={orbitalDistance}
            orbitalPeriod={orbitalPeriod}
            onSelect={onPlanetSelect}
          />
        )
      })}
      
      {/* Zoom indicator (for debugging) */}
      {process.env.NODE_ENV === 'development' && (
        <mesh position={[0, 25, 0]}>
          <textGeometry args={[`Zoom: ${(zoomRef.current * 100).toFixed(0)}%`, { size: 0.5, height: 0.1 }]} />
          <meshBasicMaterial color={0xffffff} />
        </mesh>
      )}
    </>
  )
}

export default ProjectPlanet
export { SolarSystem }