export default class ImageGray{
    constructor(dom,src,radius) {
        this.dom=dom
        this.el=document.createElement("div")
        this.dom.appendChild(this.el)
        this.el.style.width="100%"
        this.el.style.height="100%"
        this.el.style.position="relative"
        this.radius=radius
        this.img=this.__createFullTag__("img")
        this.img.src=src
        this.img.style.filter="grayScale(1)"
        this.el.appendChild(this.img)

        this.canvas=this.__createFullTag__("canvas")
        this.canvas.width=dom.clientWidth*window.devicePixelRatio
        this.canvas.height=dom.clientHeight*window.devicePixelRatio
        this.el.appendChild(this.canvas)

        this.resize=this.resize.bind(this)
        this.mouseover=this.mouseover.bind(this)
        this.mousemove=this.mousemove.bind(this)
        this.mouseout=this.mouseout.bind(this)
        window.addEventListener("resize",this.resize)
        this.canvas.addEventListener("mouseover",this.mouseover)
        this.canvas.addEventListener("mousemove",this.mousemove)
        this.canvas.addEventListener("mouseout",this.mouseout)
        this.ctx=this.canvas.getContext("2d")
    }

    resize(){
        this.canvas.width=this.dom.clientWidth*window.devicePixelRatio
        this.canvas.height=this.dom.clientHeight*window.devicePixelRatio
    }

    mouseover(e){
        this.over=true
        this.mousemove(e)
    }

    mousemove(e){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        if(!this.over)return
        this.ctx.save()
        this.ctx.scale(window.devicePixelRatio,window.devicePixelRatio)
        this.ctx.beginPath()

        //渐变裁剪
        let grd=this.ctx.createRadialGradient(e.offsetX,e.offsetY,0,e.offsetX,e.offsetY,this.radius)
        grd.addColorStop(0,"rgba(0,0,0,1)")
        grd.addColorStop(0.8,"rgba(0,0,0,1)")
        grd.addColorStop(1,"rgba(0,0,0,0)")
        this.ctx.fillStyle=grd
        this.ctx.arc(e.offsetX,e.offsetY,this.radius,0,Math.PI*2)
        this.ctx.fill()
        this.ctx.globalCompositeOperation="source-in"
        
        //直接裁剪
        // this.ctx.arc(e.offsetX,e.offsetY,this.radius,0,Math.PI*2)
        //this.ctx.clip()

        this.ctx.drawImage(this.img,0,0,this.canvas.width,this.canvas.height)
        this.ctx.restore()
    }
    mouseout(e){
        this.over=false
        this.mousemove(e)
    }
    __createFullTag__(tag){
        let dom=document.createElement(tag)
        dom.style.position="absolute"
        dom.style.left="0"
        dom.style.top="0"
        dom.style.width="100%"
        dom.style.height="100%"
        return dom
    }
    destroy(){
        window.removeEventListener("resize",this.resize)
        this.canvas.removeEventListener("mouseover",this.mouseover)
        this.canvas.removeEventListener("mousemove",this.mousemove)
        this.canvas.removeEventListener("mouseout",this.mouseout)
        this.el.remove()
    }
}
