"use client"

import {useEffect, useRef, useState} from "react"
import type {Prize, WheelConfig} from "@/types/prize"

interface WheelProps {
    prizes: Prize[]
    config: WheelConfig
    isSpinning: boolean
    onSpinEnd: (prize: Prize) => void
}

export function Wheel({prizes, config, isSpinning, onSpinEnd}: WheelProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [rotation, setRotation] = useState(0)
    const [selectedPrizeIndex, setSelectedPrizeIndex] = useState<number | null>(null)
    const requestRef = useRef<number>(null)
    const startTimeRef = useRef<number>(0)
    const spinDuration = 5000 // 5 seconds
    const maxRotations = 10 // Number of full rotations before stopping
    const [imagesLoaded, setImagesLoaded] = useState(false)
    const prizeImagesRef = useRef<Record<string, HTMLImageElement | null>>({})
    const centerImageRef = useRef<HTMLImageElement | null>(null)
    const [centerImageLoaded, setCenterImageLoaded] = useState(false)

    // Preload images
    useEffect(() => {
        const loadImages = async () => {
            // Load prize images
            const imagePromises = prizes.map((prize) => {
                return new Promise<void>((resolve) => {
                    if (!prize.imageUrl) {
                        prizeImagesRef.current[prize.id] = null
                        resolve()
                        return
                    }

                    const img = new Image()
                    img.crossOrigin = "anonymous"
                    img.onload = () => {
                        prizeImagesRef.current[prize.id] = img
                        resolve()
                    }
                    img.onerror = () => {
                        console.error(`Failed to load image: ${prize.imageUrl}`)
                        prizeImagesRef.current[prize.id] = null
                        resolve()
                    }
                    img.src = prize.imageUrl
                })
            })

            // Load center image
            const centerImagePromise = new Promise<void>((resolve) => {
                if (!config.centerImage) {
                    setCenterImageLoaded(false)
                    resolve()
                    return
                }

                const img = new Image()
                img.crossOrigin = "anonymous"
                img.onload = () => {
                    centerImageRef.current = img
                    setCenterImageLoaded(true)
                    resolve()
                }
                img.onerror = () => {
                    console.error(`Failed to load center image: ${config.centerImage}`)
                    centerImageRef.current = null
                    setCenterImageLoaded(false)
                    resolve()
                }
                img.src = config.centerImage
            })

            await Promise.all([...imagePromises, centerImagePromise])
            setImagesLoaded(true)
        }

        loadImages()
    }, [prizes, config.centerImage])

    // Draw the wheel
    useEffect(() => {
        if (!imagesLoaded) return

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const radius = Math.min(centerX, centerY) - 10

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw outer decorative ring
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI)
        ctx.strokeStyle = config.borderColor || "#FF9FF3"
        ctx.lineWidth = 30
        ctx.stroke()

        const dotCount = 10; // Số chấm
        const dotSize = 10;  // Kích thước chấm (bán kính)

        for (let i = 0; i < dotCount; i++) {
            const angle = (i * (360 / dotCount) * Math.PI) / 180;
            const dotX = centerX + (radius + 5) * Math.cos(angle);
            const dotY = centerY + (radius + 5) * Math.sin(angle);

            ctx.beginPath();
            ctx.arc(dotX, dotY, dotSize, 0, 2 * Math.PI);
            ctx.fillStyle = "#FFFFFF";
            ctx.fill();
        }

        // Draw wheel segments
        const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0)
        let startAngle = rotation

        prizes.forEach((prize, index) => {
            const sliceAngle = (2 * Math.PI * prize.probability) / totalProbability
            const endAngle = startAngle + sliceAngle

            // Draw segment
            ctx.beginPath()
            ctx.moveTo(centerX, centerY)
            ctx.arc(centerX, centerY, radius, startAngle, endAngle)
            ctx.closePath()

            // Fill segment with gradient
            ctx.fillStyle = prize.backgroundColor || `hsl(${index * 60}, 70%, 50%)`
            ctx.fill()

            // Add a stroke for better separation
            ctx.strokeStyle = "#FFFFFF"
            ctx.lineWidth = 2
            ctx.stroke()

            // Draw image if available
            if (prize.imageUrl && prizeImagesRef.current[prize.id]) {
                const img = prizeImagesRef.current[prize.id]
                if (img) {
                    const maxImgSize = 160 // Kích thước tối đa của hình ảnh
                    const imgDistance = radius * 0.6 // Khoảng cách từ tâm
            
                    // Tính tỷ lệ để giữ nguyên khung hình
                    const imgRatio = img.width / img.height
                    let imgWidth, imgHeight
                    
                    if (imgRatio >= 1) { // Ảnh ngang hoặc vuông
                        imgWidth = maxImgSize
                        imgHeight = maxImgSize / imgRatio
                    } else { // Ảnh dọc
                        imgHeight = maxImgSize
                        imgWidth = maxImgSize * imgRatio
                    }
            
                    // Tính vị trí cho hình ảnh
                    const imgAngle = startAngle + sliceAngle / 2
                    const imgX = centerX + Math.cos(imgAngle) * imgDistance
                    const imgY = centerY + Math.sin(imgAngle) * imgDistance
            
                    // Lưu trạng thái context
                    ctx.save()
            
                    // Di chuyển đến vị trí hình ảnh
                    ctx.translate(imgX, imgY)
            
                    // Xoay để căn chỉnh với phân đoạn
                    ctx.rotate(imgAngle)
                    
                    // Vẽ hình ảnh đã căn chỉnh
                    ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight)
            
                    // Khôi phục trạng thái context
                    ctx.restore()
                }
            }

            // Draw text
            ctx.save()
            ctx.translate(centerX, centerY)
            const textAngle = startAngle + sliceAngle / 2
            ctx.rotate(textAngle)
            ctx.textAlign = "right"
            ctx.font = "bold 14px 'Comic Sans MS', cursive"
            ctx.shadowColor = "rgba(0,0,0,0.5)"
            ctx.shadowBlur = 3
            ctx.shadowOffsetX = 1
            ctx.shadowOffsetY = 1

            // Use the wheelDisplayName for the wheel
            if (!prize.imageUrl || prize.imageUrl == '') {
                ctx.fillText(prize.wheelDisplayName || "Prize", radius - 20, 5)
            }
            ctx.restore()

            startAngle = endAngle
        })

        // Draw center circle with image
        const centerRadius = 30

        // Draw center circle background
        ctx.beginPath()
        ctx.arc(centerX, centerY, centerRadius, 0, 2 * Math.PI)
        const centerGradient = ctx.createRadialGradient(centerX - 5, centerY - 5, 0, centerX, centerY, centerRadius)
        centerGradient.addColorStop(0, "#FFC0CB") // Pink
        centerGradient.addColorStop(1, "#FF69B4") // Hot Pink
        ctx.fillStyle = centerGradient
        ctx.fill()
        ctx.strokeStyle = "#FFFFFF"
        ctx.lineWidth = 3
        ctx.stroke()

        // Draw center image if available and loaded successfully
        if (centerImageLoaded && centerImageRef.current) {
            const centerImg = centerImageRef.current
            const imgSize = centerRadius * 1.8 // Make image slightly larger than the circle

            // Draw the image centered
            ctx.fillStyle = "#FFFFFF"
            ctx.drawImage(centerImg, centerX - imgSize / 2, centerY - imgSize / 2, imgSize, imgSize)
        } else {
            // Fallback to drawing a cute face if no image is available or failed to load
            // Eyes
            ctx.beginPath()
            ctx.arc(centerX - 10, centerY - 5, 5, 0, 2 * Math.PI)
            ctx.arc(centerX + 10, centerY - 5, 5, 0, 2 * Math.PI)
            ctx.fillStyle = "#FFFFFF"
            ctx.fill()

            // Pupils
            ctx.beginPath()
            ctx.arc(centerX - 10, centerY - 5, 2, 0, 2 * Math.PI)
            ctx.arc(centerX + 10, centerY - 5, 2, 0, 2 * Math.PI)
            ctx.fillStyle = "#000000"
            ctx.fill()

            // Smile
            ctx.beginPath()
            ctx.arc(centerX, centerY + 5, 10, 0, Math.PI)
            ctx.strokeStyle = "#FFFFFF"
            ctx.lineWidth = 2
            ctx.stroke()
        }

        // Draw pointer
        ctx.beginPath()
        ctx.moveTo(centerX + radius - 15, centerY); // Đổi hướng mũi tam giác
        ctx.lineTo(centerX + radius + 5, centerY - 15);
        ctx.lineTo(centerX + radius + 5, centerY + 15);
        ctx.closePath()
        const pointerGradient = ctx.createLinearGradient(centerX + radius - 5, centerY - 15, centerX + radius + 15, centerY)
        pointerGradient.addColorStop(0, config.pointerColor || "#FF1493") // Deep Pink
        pointerGradient.addColorStop(1, "#FF69B4") // Hot Pink
        ctx.fillStyle = pointerGradient
        ctx.fill()
        ctx.strokeStyle = "#FFFFFF"
        ctx.lineWidth = 2
        ctx.stroke()

        // Add sparkles around the wheel
        for (let i = 0; i < 8; i++) {
            const angle = (i * 45 * Math.PI) / 180
            const sparkleX = centerX + (radius + 30) * Math.cos(angle)
            const sparkleY = centerY + (radius + 30) * Math.sin(angle)

            // Draw a star
            drawStar(ctx, sparkleX, sparkleY, 5, 10, 5)
        }
    }, [prizes, rotation, imagesLoaded, config, centerImageLoaded])

    // Function to draw a star
    const drawStar = (
        ctx: CanvasRenderingContext2D,
        cx: number,
        cy: number,
        spikes: number,
        outerRadius: number,
        innerRadius: number,
    ) => {
        let rot = (Math.PI / 2) * 3
        let x = cx
        let y = cy
        const step = Math.PI / spikes

        ctx.beginPath()
        ctx.moveTo(cx, cy - outerRadius)
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius
            y = cy + Math.sin(rot) * outerRadius
            ctx.lineTo(x, y)
            rot += step

            x = cx + Math.cos(rot) * innerRadius
            y = cy + Math.sin(rot) * innerRadius
            ctx.lineTo(x, y)
            rot += step
        }
        ctx.lineTo(cx, cy - outerRadius)
        ctx.closePath()
        ctx.fillStyle = "#FFD700" // Gold
        ctx.fill()
        ctx.strokeStyle = "#FFFFFF"
        ctx.lineWidth = 1
        ctx.stroke()
    }

    // Handle spinning animation
    useEffect(() => {
        if (!isSpinning) {
            cancelAnimationFrame(requestRef.current!)

            if (selectedPrizeIndex !== null) {
                onSpinEnd(prizes[selectedPrizeIndex])
                setSelectedPrizeIndex(null)
            }
            return
        }

        // Determine the winning prize based on probability
        const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0)
        const randomValue = Math.random() * totalProbability
        let cumulativeProbability = 0
        let winningIndex = 0

        for (let i = 0; i < prizes.length; i++) {
            cumulativeProbability += prizes[i].probability
            if (randomValue <= cumulativeProbability) {
                winningIndex = i
                break
            }
        }

        // Calculate the final rotation to land on the winning prize
        const sliceAngle = (2 * Math.PI) / prizes.length
        const targetRotation = 2 * Math.PI * maxRotations + (2 * Math.PI - (winningIndex * sliceAngle + sliceAngle / 2))

        startTimeRef.current = performance.now()
        setSelectedPrizeIndex(winningIndex)

        const animate = (time: number) => {
            const elapsed = time - startTimeRef.current
            const progress = Math.min(elapsed / spinDuration, 1)

            // Easing function for smooth deceleration
            const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
            const currentRotation = targetRotation * easeOut(progress)

            setRotation(currentRotation)

            if (progress < 1) {
                requestRef.current = requestAnimationFrame(animate)
            } else {
                onSpinEnd(prizes[winningIndex])
                setSelectedPrizeIndex(null)
            }
        }

        requestRef.current = requestAnimationFrame(animate)

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current)
            }
        }
    }, [isSpinning, prizes, onSpinEnd, selectedPrizeIndex])

    return (
        <div className="relative">
            <canvas
                ref={canvasRef}
                width={440}
                height={440}
                className={`border-8 border-pink-300 rounded-full shadow-lg transition-all duration-300 ${
                    isSpinning ? "shadow-xl" : ""
                }`}
            />
            {isSpinning && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 border-t-4 border-b-4 border-pink-500 rounded-full animate-spin"></div>
                </div>
            )}
            <div className="absolute inset-0 pointer-events-none">
                {Array.from({length: 12}).map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-3 h-3 bg-yellow-300 rounded-full animate-ping"
                        style={{
                            top: `${10 + Math.random() * 80}%`,
                            left: `${10 + Math.random() * 80}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: `${1 + Math.random() * 3}s`,
                        }}
                    ></div>
                ))}
            </div>
        </div>
    )
}

