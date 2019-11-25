{
    let view={
        el:'.uploadArea',
        find:(selector){
            return $(this.el).find(selector)[0]
}
    }
    let model={}
    let controller ={
      init(view, model){
          this.view = view
          this.model=model
      } ,
        initQiniu(){

        }
    }
}