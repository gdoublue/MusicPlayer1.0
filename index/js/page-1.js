{
    let view = {
        el:'.page-1',
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
            this.loadModule1()
            this.loadModule2()
        },
        bindEvents(){
            window.eventHub.on('selectTab',(tabName)=>{
                if(tabName==='page-1'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
        },
        loadModule1(){
            let script1=document.createElement('script')
            script1.src='index/js/page-1-1.js'
            script1.onload=function () {
                console.log('loading 1 complete')
            }
            document.body.appendChild(script1)
        },
        loadModule2(){
            let script2=document.createElement('script')
            script2.src='index/js/page-1-2.js'
            script2.onload=function () {
                console.log('loading 2 complete')
            }
            document.body.appendChild(script2)
        },

    }

    controller.init(view,model)

}