{
    let view= {
        el:'#app',
        template:`
       
        `,
        render(data){
            document.title=data.song
           $('.song-description> h1').html(data.song)
            $(this.el).find('audio').attr('src',data.url)


        },
        play(){
            let audio=$(this.el).find('audio')[0]
            audio.play()
            $(this.el).find('.disc-container').addClass('playing')
        },
        pause(){
            let audio=$(this.el).find('audio')[0]
            audio.pause()
            $(this.el).find('.disc-container').removeClass('playing')
        },
    }
    let model={
        data:{

        },
        status:true,

        get(id){
            var songQuery= new AV.Query('Song')
            return songQuery.get(id).then((song)=>{
                 Object.assign(this.data,song.attributes)
            })
        }
    }

    let controller={
        init(view,model){
            this.view=view
            this.model=model
            let id = this.getSongId()
            this.model.get(id).then(()=>{
                console.log(this.model.data)
                this.view.render(this.model.data)
            })
            console.log('1')
            setTimeout(()=>{this.view.play()},1300)
            this.bindEvents()

        },
        bindEvents(){
          $('.disc').on('click',()=>{
             this.model.status =! this.model.status
              if (this.model.status){
                    this.view.pause()
                  console.log(this.model.status)
              }else{
                this.view.play()
                  console.log(this.model.status)
              }
          })

        },
        getSongId(){
            let search=window.location.search
            if(search.indexOf('?')===0){
                search=search.substring(1)
            }
            let  array = search.split('&').filter((v=>v))  //假的不要 ，如空字符串
            let id=" "
            for(let i=0;i<array.length;i++){
                let kv=array[i].split('=')
                let key=kv[0]
                let value=kv[1]
                if(key==='id'){
                    id=value
                    break
                }
            }
            return id
        },

    }
    controller.init(view,model)
}