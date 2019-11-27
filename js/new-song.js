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
            $('.uploadArea').addClass('active')
            window.eventHub.emit('new')
        },
        deactive(){
            $(this.el).removeClass('active')
            $('.uploadArea').removeClass('active')
        }
    }
    let model={}
    let controller={
        init(view,model){
            this.view=view
            this.model=model
            this.view.render(this.model.data)
            // this.view.active()
            this.bindeEventHub()
            $(this.view.el).on('click',()=>{
                this.view.active()
            })
        },
        bindeEventHub(){

            window.eventHub.on('select',(data)=>{
                this.view.deactive()
            })
        },

    }
    controller.init(view,model)
}