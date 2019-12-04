{
    let view= {
        el:'#app',
        template:`
       
        `,
        render(data){
            document.title=data.song+' - '+data.singer
            $(this.el).find('.bgp').css('background-image',`url('${data.coverUrl}')`)
            $(this.el).find('.cover').attr('src',data.coverUrl)
           $('.song-description> h1').html(data.song+' - ')
           $('.song-description> h2').html(data.singer)
           let audio = $(this.el).find('audio').attr('src',data.url)
                .on('ended',()=>{
                    this.pause() //播完就暂停
                    // window.eventHub.emit('songEnd')
                    console.log('播放完毕')
                })

            audio[0].ontimeupdate=()=>{
                // console.log(audio[0].currentTime)
             this.showLyric(audio[0].currentTime)
            }
            let {lyric} = data

            if(lyric){
                lyric.split('\n').map((string)=>{
                    let p =document.createElement('p')
                    let regex=/\[([\d:.]+)\](.+)/
                    let matches = string.match(regex)

                    if(matches) {
                        p.textContent = matches[2]
                        let time = matches[1]
                        let parts = time.split(':')
                        let minutes = parts[0]
                        let seconds = parts[1]
                        let newTime = parseInt(minutes) * 60 + parseFloat(seconds, 10)
                        p.setAttribute('data-time', newTime)
                    }
                    else{
                            p.textContent=string
                        }
                        $(this.el).find('.lyric>.lines').append(p)
                    }
                )
            }

           return data

        },
        play(){

            let audio=$(this.el).find('audio')[0]
            if (audio.paused) { //判读是否播放
                audio.paused=false;
                audio.play(); //没有就播放

            }
            if (!audio.paused){
                $(this.el).find('.disc-container').addClass('playing')
            }


        },
        pause(){
            let audio=$(this.el).find('audio')[0]
            audio.pause()
            if(audio.paused){
                $(this.el).find('.disc-container').removeClass('playing')
            }

        },
        showLyric(time){
            let allP=$(this.el).find('.lyric>.lines>p')
            let p
            for(let i=0;i<allP.length;i++){
                if(i===allP.lenght-1){
                    p=allP[i]

                }else{

                    let currentTime=allP.eq(i).attr('data-time')
                    let nextTime=allP.eq(i+1).attr('data-time')
                    if(currentTime<=time&&time<nextTime){

                        p=allP[i]
                        break
                    }
                }
            }

            let pHeight=$(p).offset().top
            let lines=$('.lyric>.lines')
            let linesHeight = lines.offset().top
            let height=pHeight-linesHeight
            lines.css({transform:`translateY(${-(height)}px)`})
            $(p).addClass('active').siblings('.active').removeClass('active')
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
                this.view.render(this.model.data)
            }).then(()=>{
              this.view.play()
                setTimeout(()=>{this.view.play()},1000)

            })
            this.bindEvents()

        },
        bindEvents(){
          $('.disc').on('click',()=>{
             this.model.status =! this.model.status
              if (this.model.status){
                    this.view.pause()

              }else{
                this.view.play()

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