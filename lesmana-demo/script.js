document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    
    // Duplicate the items to ensure a seamless infinite scroll
    const originalItems = track.innerHTML;
    track.innerHTML += originalItems + originalItems + originalItems;
    
    const items = document.querySelectorAll('.carousel-item');
    let offset = 0;
    const speed = 1.2; 

    // Add hover tracking
    let isAnyHovered = false;
    
    items.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('mouseenter', () => {
            item.classList.add('hovered');
            isAnyHovered = true;
        });
        item.addEventListener('mouseleave', () => {
            item.classList.remove('hovered');
            isAnyHovered = document.querySelectorAll('.carousel-item.hovered').length > 0;
        });
    });

    function animate() {
        offset -= speed;
        
        const singleSetWidth = track.scrollWidth / 4; 
        if (Math.abs(offset) >= singleSetWidth) {
            offset = 0;
        }
        
        track.style.transform = `translateX(${offset}px)`;
        
        const centerX = window.innerWidth / 2;
        const maxDistance = window.innerWidth * 0.8; 
        const maxRotation = 35; 
        
        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            const itemCenterX = rect.left + rect.width / 2;
            const dist = itemCenterX - centerX;
            
            // CONCAVE CURVE:
            // Left side (dist < 0): needs to face right -> positive rotation
            // Right side (dist > 0): needs to face left -> negative rotation
            let rotation = -(dist / maxDistance) * maxRotation;
            rotation = Math.max(-maxRotation, Math.min(maxRotation, rotation));
            
            let scale = 1 - Math.abs(dist / maxDistance) * 0.05;
            
            // For concave, center is furthest back, edges come forward
            let translateZ = -350 + (Math.abs(dist / maxDistance) * 350);
            
            // If hovered, slightly scale up
            if (item.classList.contains('hovered')) {
                scale += 0.05;
                translateZ += 30;
                item.style.boxShadow = '0 0 40px rgba(255,255,255,0.2)';
            } else {
                item.style.boxShadow = '0 30px 60px rgba(0,0,0,0.8)';
            }
            
            item.style.transform = `rotateY(${rotation}deg) scale(${scale}) translateZ(${translateZ}px)`;
            
            // Opacity Logic
            if (isAnyHovered) {
                // If anything is hovered, only the hovered item is fully visible
                item.style.opacity = item.classList.contains('hovered') ? 1 : 0.15;
            } else {
                // Default: fade out at edges
                let opacity = 1 - Math.abs(dist / maxDistance) * 0.6;
                item.style.opacity = Math.max(0.3, opacity);
            }
        });
        
        requestAnimationFrame(animate);
    }

    animate();
});
