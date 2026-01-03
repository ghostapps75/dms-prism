import * as THREE from 'three';

// Mutable state bucket for an entity's brain
export interface AIState {
    target: THREE.Vector3;
    waitTime: number; // if > 0, we are standing still
}

export function pickRandomTarget(range: number): THREE.Vector3 {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * range;
    return new THREE.Vector3(
        Math.cos(angle) * dist,
        0,
        Math.sin(angle) * dist
    );
}

export function stepWander(
    currentPos: THREE.Vector3,
    currentRot: THREE.Euler,
    ai: AIState,
    dt: number,
    speed: number,
    range: number
): { moving: boolean } {

    // 1. Check if waiting
    if (ai.waitTime > 0) {
        ai.waitTime -= dt;
        return { moving: false };
    }

    // 2. Distance to target
    const dist = currentPos.distanceTo(ai.target);
    const STOP_THRESHOLD = 0.5;

    if (dist < STOP_THRESHOLD) {
        // Arrived! Pick new target and wait
        ai.target.copy(pickRandomTarget(range));
        ai.waitTime = 1 + Math.random() * 3; // wait 1-4s
        return { moving: false };
    }

    // 3. Move towards target
    // Determine desired angle
    const dx = ai.target.x - currentPos.x;
    const dz = ai.target.z - currentPos.z;
    const targetAngle = Math.atan2(dx, dz); // In Three.js, facing usually depends on model orientation. Assuming +Z or lookAt logic.

    // Smooth rotation (Lerp angle)
    // We normalize angles to avoid spinning 360 unnecessarily
    let diff = targetAngle - currentRot.y;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;

    const turnSpeed = 3.0; // rad/s
    currentRot.y += Math.max(-turnSpeed * dt, Math.min(turnSpeed * dt, diff));

    // Forward movement
    // Move along the CURRENT facing vector, not purely towards target (creates arcs)
    const moveDist = speed * dt;
    currentPos.x += Math.sin(currentRot.y) * moveDist;
    currentPos.z += Math.cos(currentRot.y) * moveDist;

    return { moving: true };
}
