{
    let view= {
        el:'#app',
        template:`
       <audio src={{url}}> </audio>
       <div>
       <h3>正在播放 {{song}}
       </h3>
       <button class="play">play</button>
       <button class="pause">PAUSE</button>
       
       
       </div>
        `,
        render(data){
            console.log(data)
            console.log(data.song)
            $(this.el).html(this.template.replace('{{url}}',data.url).replace('{{song}}',data.song))
        },
        play(){
            let audio=$(this.el).find('audio')[0]
            audio.play()
        },
        pause(){
            let audio=$(this.el).find('audio')[0]
            audio.pause()
        },
    }
    let model={
        data:{

        },

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



            this.bindEvents()
        },
        bindEvents(){
          $(this.view.el).on('click','.play',()=>{
              this.view.play()
          })
          $(this.view.el).on('click','.pause',()=>{
                this.view.pause()
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