class Car{
    constructor(x,y,width,height,controlType, maxSpeed=3){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0;
        this.acceleration=0.2;
        this.maxSpeed=maxSpeed;
        this.friction=0.05;
        this.angle=0;

        this.damaged = false;
        if(controlType !== "DUMMY"){
            this.sensor=new Sensor(this);

        }

        this.controls=new Controls(controlType);
    }

    update(roadBorders, traffic){
        if(!this.damaged)
        {
            this.#move();
            this.polygone = this.#createPolygone();
            this.damaged= this.#assessDamage(roadBorders,traffic)
        }
        if(this.sensor)
        {
            this.sensor.update(roadBorders,traffic);
        }


    }

    #assessDamage(roadBorders,traffic) {
        for(let i = 0; i< roadBorders.length; i++)
        {
            if (polysIntersect(this.polygone,roadBorders[i]))
            {
                return true;
            }
        }
        for(let i = 0; i< traffic.length; i++)
        {
            if (polysIntersect(this.polygone,traffic[i].polygone))
            {
                return true;
            }
        }
        return false;
    }

    #createPolygone()
    {
        const points = [];
        const rad = Math.hypot(this.width, this.height)/2;
        const alpha = Math.atan2(this.width,this.height);
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });
        return points;
    }

    #move(){
        if(this.controls.forward){
            this.speed+=this.acceleration;
        }
        if(this.controls.reverse){
            this.speed-=this.acceleration;
        }

        if(this.speed>this.maxSpeed){
            this.speed=this.maxSpeed;
        }
        if(this.speed<-this.maxSpeed/2){
            this.speed=-this.maxSpeed/2;
        }

        if(this.speed>0){
            this.speed-=this.friction;
        }
        if(this.speed<0){
            this.speed+=this.friction;
        }
        if(Math.abs(this.speed)<this.friction){
            this.speed=0;
        }

        if(this.speed!=0){
            const flip=this.speed>0?1:-1;
            if(this.controls.left){
                this.angle+=0.03*flip;
            }
            if(this.controls.right){
                this.angle-=0.03*flip;
            }
        }

        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }

    draw(ctx,color){
        if (this.damaged)
        {
            ctx.fillStyle="gray";
        }
        else
        {
            ctx.fillStyle=color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygone[0].x, this.polygone[0].y);
        for(let i = 1; i< this.polygone.length;i++)
        {
            ctx.lineTo(this.polygone[i].x, this.polygone[i].y);

        }
        ctx.fill();
        if (this.sensor){
            this.sensor.draw(ctx);

        }
    }


}