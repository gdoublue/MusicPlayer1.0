{
    let view ={
        el:'#tabs',
        init(){
            this.$el =$(this.el)
        }
    }
    let model ={}
    let controller = {
        init(view,model) {
            this.view = view
            this.model=model
            this.view.init()
            this.bindEvents()
        },
        bindEvents(){
            this.view.$el.on('click','.tabs-nav > li',(e)=>{

                let $li=$(e.currentTarget)
                let tabName =$li.attr('data-tab-name')
                $li.addClass('active')
                    .siblings().removeClass('active')
                window.eventHub.emit('selectTab',tabName)
            })
            $('.topbton').on('click',(e)=>{
                e.preventDefault()
               window.open('https://music.163.com/api/android/download/deeplink?resourceType=playlist&resourceValue=19723756')
            })
        }

    }
    controller.init(view,model)
}