let fq = 1.25;
let c;
let level = [];
let moonColor;

function setup() {
    createCanvas(1200, 500);
    noLoop();
    level = new Array(width + 1);
    noStroke();
}

function draw() {
    c = getColor();
    moonColor = c;
    let cb = color(red(c) * 0.7, green(c) * 0.7, blue(c) * 0.7);
    let cf = color(red(c) * 0.15, green(c) * 0.15, blue(c) * 0.15);
    
    background(cb);
    
    noStroke();
    fill(c);
    ellipse(width * 0.7, height * 0.45, height * 0.5, height * 0.5);
    
    layer(0.275, lerpColor(cb, cf, 0.1), lerpColor(cb, cf, 0.15), 50, 8);
    layer(0.55, lerpColor(cb, cf, 0.4), lerpColor(cb, cf, 0.5), 40, 10);
    layer(1.1, lerpColor(cb, cf, 0.8), cf, 20, 12);
}

function keyPressed() {
    redraw();
    return false;
}

function mousePressed() {
    redraw();
}

function layer(sz, cs, c, g, d) {
    calcLevel(sz, g);
    fill(cs);
    for (let x = 0; x < width; x++) {
        if (random(1.0) < (0.01 / sz)) stone(x, sz);
    }
    fill(c);
    ground(sz);
    
    let x = random(80 * sz, 240 * sz) / fq;
    while (x < width) {
        tree(x, random(sz * 0.75, sz * 1.25), 0.3, 0.1, d);
        x += random(80 * sz, 240 * sz) / fq;
    }
    
    x = random(120 * sz, 360 * sz) / fq;
    while (x < width) {
        bush(x, random(sz * 0.75, sz * 1.25), 0.3, 0.1, d * 3 / 4);
        x += random(120 * sz, 360 * sz) / fq;
    }
}

function calcLevel(sz, g) {
    let x = 0;
    let d = Math.floor(sz * 150);
    let p = Math.floor(random(d / 4, d));
    let s = 0;
    let v = 25 * sz;
    let v1 = random(v);
    let v2 = random(v);
    
    while (x <= width) {
        level[x] = height - g - (v1 + (v2 - v1) * s / p);
        x++;
        if (s === p) {
            s = 0;
            p = Math.floor(random(d / 4, d));
            v1 = v2;
            v2 = random(v);
        } else {
            s++;
        }
    }
}

function getLevel(x) {
    return level[(Math.floor(x + 2 * width)) % width];
}

function ground(sz) {
    beginShape();
    vertex(0, height);
    for (let x = 0; x <= width; x++) {
        vertex(x, level[x] - sz * random(-2, 2));
    }
    vertex(width, height);
    endShape(CLOSE);
}

function stone(x, sz) {
    let a = PI * 0.7;
    let ad = -a;
    let d = sz * width / 100;
    let r;
    let y = getLevel(x);
    let f = true;
    
    d *= random(0.5, 1.5);
    if (random(1.0) < 0.1) d *= 3;
    
    r = random(d * 0.8, d * 1.2);
    y += random(d * 0.1, d * 0.25);
    
    beginShape();
    while (f) {
        if (ad > a) {
            ad = a;
            f = false;
        }
        r += random(-d * 0.1, d * 0.1);
        vertex(x + r * sin(ad), y - 0.5 * r * cos(ad));
        ad += random(0.1, 0.3);
    }
    endShape(CLOSE);
}

function bush(x, sz, rb, rj, d) {
    sz *= random(0.3, 0.5);
    push();
    translate(x, getLevel(x) + random(100, 200) * sz);
    rotate(random(-0.1, 0.1));
    branch(sz, rb, rj, d, true);
    pop();
}

function tree(x, sz, rb, rj, d) {
    push();
    translate(x, getLevel(x) + 6 * sz);
    rotate(random(-0.1, 0.1));
    branch(sz, rb, rj, d, true);
    pop();
}

function branch(sz, b, j, d, s) {
    let w = 12 * sz;
    let sc;
    if (s) sc = 0.8;
    else sc = 0.9;
    
    if (d > 0) {
        let v = (random(1.0) < 0.6);
        fromto(0, 0, 0, -height * 0.15 * sz, w, w * sc, v);
        translate(0, -height * 0.15 * sz);
        rotate(random(-0.1, 0.1));
        
        if (v) {
            scale(sc * 0.833);
            push();
            rotate(random(b - j, b + j));
            branch(sz, b, j, d - 1, false);
            pop();
            push();
            rotate(random(-b - j, -b + j));
            branch(sz, b, j, d - 1, false);
            pop();
        } else {
            scale(sc);
            branch(sz, b, j, d, false);
        }
    }
}

function getColor() {
    let choice = Math.floor(random(3));
    switch(choice) {
        case 0:
            return color(random(85, 105), random(135, 155), random(165, 185));
        case 1:
            return color(random(165, 185), random(115, 135), random(125, 145));
        case 2:
            return color(random(140, 150), random(140, 160), random(140, 160));
        default:
            return color(255);
    }
}

function fromto(x1, y1, x2, y2, w1, w2, v) {
    if (!calcDxDy(x1, y1, x2, y2)) return;
    
    beginShape();
    let dx = Dx * w1 / 2;
    let dy = Dy * w1 / 2;
    
    vertex(x1 - dy, y1 + dx);
    vertex(x1 - dx, y1 - dy);
    vertex(x1 + dy, y1 - dx);
    
    dx = Dx * w2 / 2;
    dy = Dy * w2 / 2;
    
    if (v) {
        vertex(x2 + dy + dx / 2, y2 - dx + dy / 2);
        vertex(x2 - dy + dx / 2, y2 + dx + dy / 2);
    } else {
        vertex(x2 + dy, y2 - dx);
        vertex(x2 + dx, y2 + dy);
        vertex(x2 - dy, y2 + dx);
    }
    endShape(CLOSE);
}

let Dx, Dy;
function calcDxDy(x1, y1, x2, y2) {
    let d;
    Dx = x2 - x1;
    Dy = y2 - y1;
    d = Dx * Dx + Dy * Dy;
    
    if (d < 0.001) return false;
    d = sqrt(d);
    Dx /= d;
    Dy /= d;
    return true;
}о
