{
    let view = {
        el:'.page-3',
        init(){
            this.$el=$(this.el)
        },
        show(){
            this.$el.addClass('active')
        },
        hide(){
            this.$el.removeClass('active')
        }
    }

    let model={}

    let controller={
        init(view,model){
            this.view=view
            this.model=model
            this.view.init()
            this.bindEvents()
        },
        bindEvents(){
            window.eventHub.on('selectTab',(tabName)=>{
                if(tabName==='page-3'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
        }
    }

    controller.init(view,model)

}