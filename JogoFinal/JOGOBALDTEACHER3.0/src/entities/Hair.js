import { Entity } from './Entity.js';

export class Hair extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, 'cabelo'); 
        this.setScale(1.5);
        this.body.setSize(70, 70);
    }
}