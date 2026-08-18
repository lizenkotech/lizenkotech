/**
 * Particles Background — LIZENKO.tech Skills Page
 * Flowing particle field on dark purple/pink background
 * Vanilla JS — no external dependencies
 *
 * Colors: purple #8B2CFF · pink #FF2FA8
 * Background: Deep black #0A0610
 */

(function () {
    'use strict';

    var canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementsByTagName('body')[0].appendChild(canvas);

    var ctx = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;
    var xC = width / 2;
    var yC = height / 2;

    var stepCount = 0;
    var particles = [];
    var lifespan = 1000;
    var popPerBirth = 1;
    var maxPop = 250;
    var birthFreq = 2;

    // Grid setup
    var gridSize = 8;
    var gridSteps = Math.floor(1000 / gridSize);
    var grid = [];
    var i = 0;

    for (var xx = -500; xx < 500; xx += gridSize) {
        for (var yy = -500; yy < 500; yy += gridSize) {
            var r = Math.sqrt(xx * xx + yy * yy);
            var r0 = 100;
            var field;

            if (r < r0) field = 255 / r0 * r;
            else if (r > r0) field = 255 - Math.min(255, (r - r0) / 2);

            grid.push({
                x: xx,
                y: yy,
                busyAge: 0,
                spotIndex: i,
                isEdge: (xx == -500 ? 'left' :
                    (xx == (-500 + gridSize * (gridSteps - 1)) ? 'right' :
                        (yy == -500 ? 'top' :
                            (yy == (-500 + gridSize * (gridSteps - 1)) ? 'bottom' :
                                false
                            )
                        )
                    )
                ),
                field: field
            });
            i++;
        }
    }

    var gridMaxIndex = i;
    var deathCount = 0;
    var drawnInLastFrame = 0;

    // Initialize dark background
    function initDraw() {
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        ctx.fillStyle = '#0A0610';
        ctx.fill();
        ctx.closePath();
    }

    // Spawn a new particle
    function birth() {
        var gridSpotIndex = Math.floor(Math.random() * gridMaxIndex);
        var gridSpot = grid[gridSpotIndex];
        var x = gridSpot.x;
        var y = gridSpot.y;

        // Occasional pink particles for variety
        var isPink = Math.random() < 0.3;

        var particle = {
            hue: isPink ? 340 : 260,  // pink-ish or purple-ish
            sat: 95,
            lum: 55 + Math.floor(25 * Math.random()),
            x: x,
            y: y,
            xLast: x,
            yLast: y,
            xSpeed: 0,
            ySpeed: 0,
            age: 0,
            ageSinceStuck: 0,
            attractor: {
                oldIndex: gridSpotIndex,
                gridSpotIndex: gridSpotIndex
            },
            name: 'seed-' + Math.ceil(10000000 * Math.random())
        };

        particles.push(particle);
    }

    // Remove a particle by name
    function kill(particleName) {
        var newArray = [];
        for (var i = 0; i < particles.length; i++) {
            if (particles[i].name !== particleName) {
                newArray.push(particles[i]);
            }
        }
        particles = newArray;
    }

    // Move all particles
    function move() {
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];

            // Save last position
            p.xLast = p.x;
            p.yLast = p.y;

            // Attractor and grid spot
            var index = p.attractor.gridSpotIndex;
            var gridSpot = grid[index];

            // Maybe move attractor
            if (Math.random() < 0.5) {
                if (!gridSpot.isEdge) {
                    var topIndex = index - 1;
                    var bottomIndex = index + 1;
                    var leftIndex = index - gridSteps;
                    var rightIndex = index + gridSteps;
                    var topSpot = grid[topIndex];
                    var bottomSpot = grid[bottomIndex];
                    var leftSpot = grid[leftIndex];
                    var rightSpot = grid[rightIndex];

                    // Pick neighbor with highest field (with randomness)
                    var chaos = 30;
                    var candidates = [topSpot, bottomSpot, leftSpot, rightSpot];
                    var maxFieldSpot = candidates[0];
                    var maxVal = maxFieldSpot.field + chaos * Math.random();

                    for (var j = 1; j < candidates.length; j++) {
                        var val = candidates[j].field + chaos * Math.random();
                        if (val > maxVal) {
                            maxVal = val;
                            maxFieldSpot = candidates[j];
                        }
                    }

                    if (maxFieldSpot.busyAge == 0 || maxFieldSpot.busyAge > 15) {
                        p.ageSinceStuck = 0;
                        p.attractor.oldIndex = index;
                        p.attractor.gridSpotIndex = maxFieldSpot.spotIndex;
                        gridSpot = maxFieldSpot;
                        gridSpot.busyAge = 1;
                    } else {
                        p.ageSinceStuck++;
                    }
                } else {
                    p.ageSinceStuck++;
                }

                if (p.ageSinceStuck == 10) kill(p.name);
            }

            // Spring attractor to grid spot with viscosity
            var k = 8;
            var visc = 0.4;
            var dx = p.x - gridSpot.x;
            var dy = p.y - gridSpot.y;
            var dist = Math.sqrt(dx * dx + dy * dy);

            var xAcc = -k * dx;
            var yAcc = -k * dy;

            p.xSpeed += xAcc;
            p.ySpeed += yAcc;
            p.xSpeed *= visc;
            p.ySpeed *= visc;

            p.speed = Math.sqrt(p.xSpeed * p.xSpeed + p.ySpeed * p.ySpeed);
            p.dist = dist;

            // Update position
            p.x += 0.1 * p.xSpeed;
            p.y += 0.1 * p.ySpeed;
            p.age++;

            if (p.age > lifespan) {
                kill(p.name);
                deathCount++;
            }
        }
    }

    // Draw everything
    function draw() {
        drawnInLastFrame = 0;
        if (!particles.length) return;

        // Fade effect
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        ctx.fillStyle = 'rgba(10, 6, 16, 0.12)';
        ctx.fill();
        ctx.closePath();

        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            var h = p.hue + stepCount / 40;
            var s = p.sat;
            var l = p.lum;
            var a = 0.9;

            var last = dataXYtoCanvasXY(p.xLast, p.yLast);
            var now = dataXYtoCanvasXY(p.x, p.y);

            var attracSpot = grid[p.attractor.gridSpotIndex];
            var attracXY = dataXYtoCanvasXY(attracSpot.x, attracSpot.y);
            var oldAttracSpot = grid[p.attractor.oldIndex];
            var oldAttracXY = dataXYtoCanvasXY(oldAttracSpot.x, oldAttracSpot.y);

            ctx.beginPath();

            var color = 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + a + ')';
            ctx.strokeStyle = color;
            ctx.fillStyle = color;

            // Particle trail
            ctx.moveTo(last.x, last.y);
            ctx.lineTo(now.x, now.y);
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.closePath();

            // Attractor line and dot
            ctx.beginPath();
            ctx.lineWidth = 1.2;
            ctx.moveTo(oldAttracXY.x, oldAttracXY.y);
            ctx.lineTo(attracXY.x, attracXY.y);
            ctx.strokeStyle = color;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(attracXY.x, attracXY.y, 1.5, 0, 2 * Math.PI, false);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();

            drawnInLastFrame++;
        }
    }

    function dataXYtoCanvasXY(x, y) {
        var zoom = 1.6;
        return {
            x: xC + x * zoom,
            y: yC + y * zoom
        };
    }

    // Main loop
    function evolve() {
        stepCount++;

        // Increment grid ages
        for (var i = 0; i < grid.length; i++) {
            if (grid[i].busyAge > 0) grid[i].busyAge++;
        }

        if (stepCount % birthFreq == 0 && (particles.length + popPerBirth) < maxPop) {
            birth();
        }

        move();
        draw();
    }

    // Start
    initDraw();
    draw();

    function frame() {
        evolve();
        requestAnimationFrame(frame);
    }
    frame();

    // Handle resize
    window.addEventListener('resize', function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        width = canvas.width;
        height = canvas.height;
        xC = width / 2;
        yC = height / 2;
        initDraw();
    });

})();
