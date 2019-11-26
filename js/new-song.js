{
    let view ={
        el:'.newSong',
        template: `
                    新建歌曲
        `,
        render(data) {
            $(this.el).html(this.template)
        },
        active(){
            $(this.el).addClass('active')
            window.eventHub.emit('new')
        },
        deactive(){
            $(this.el).removeClass('active')
        }
    }
    let model={}
    let controller={
        init(view,model){
            this.view=view
            this.model=model
            this.view.render(this.model.data)
            this.view.active()
            this.bindeEventHub()
        },
        bindeEventHub(){
            window.eventHub.on('upload',(data)=>{
                this.active()


            })
            window.eventHub.on('select',(data)=>{
                this.view.deactive()
                console.log('dededeacactitititiveveve')
            })
        },

    }
    controller.init(view,model)
}