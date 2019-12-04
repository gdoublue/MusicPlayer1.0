{
    let view = {
        el:'.workArea > main',
        init(){
            this.$el=$(this.el)
        },
        template:`
        
        <form class="form">
            <div class="row">
                <label>
                    歌名</label>
                    <input type="text" name="name" value="__song__">

            </div>
            <div class="row">
                <label>
                    歌手 </label>
                    <input type="text" name="singer" value="__singer__">

            </div>
            <div class="row">
                <label>
                    歌曲外链  </label>
                    <input type="text" name="url" value="__url__">


            </div>
            <div class="row">
                <label>封面外链</label>
                <input type="text" name="coverUrl" value="__coverUrl__">
            </div>
             <div class="row">
                <label>歌词</label>
                <textarea name="lyric" cols="50" rows="30">__lyric__</textarea>
            </div>
            <div class="row actions">
                <button type="submit">保*存</button> <button type="button" class="deleteSong">删除</button>
            </div>

        </form>
        
        `,
        render(data={}) {
            let placeholder = ['song', 'url', 'singer','id','coverUrl','lyric']
            let html = this.template
            placeholder.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
            if(data.coverUrl){
                $('#cover-clickable').removeClass('active')
                $('#cover-draggable').css("background-image",`url(${data.coverUrl})`)
            }
            else{
                $('#cover-clickable').addClass('active')
                $('#cover-draggable').css("background-image",`url( )`)
            }

            if(data.id){
                $(this.el).prepend('<h1>编辑歌曲</h1>')
            }else{
                $(this.el).prepend('<h1>新建歌曲</h1>')
            }
        },
        reset() {
            this.render({})

        }
    }

    let model={
        data:{song:'',singer:'',url:'',id:'',coverUrl:'',lyric:''},
        create(data){
            var song = AV.Object.extend('Song');
            let Song = new song();
            Song.set({
                song:data.name,
                singer:data.singer,
                url:data.url,
                coverUrl:data.coverUrl,
                lyric:data.lyric,
            });
           return  Song.save().then((newSong) =>{
                let {id, attributes} = newSong
                Object.assign(this.data,{id,...attributes})    //将保存到网上的数据也拷一份到this.data
               // alert('保存成功')
            }, (error)=>{console.error(error)})
        },
        update(data){
            var song=AV.Object.createWithoutData('Song',this.data.id)
           song.set({
                song:data.name,
                singer:data.singer,
                url:data.url,
               coverUrl:data.coverUrl,
               lyric:data.lyric,
            });
            return song.save().then((response)=>{
                let {id, attributes} = response
                Object.assign(this.data,{id,...attributes})
                return response
            },(error)=>{console.error(error)})
        },
        deleteSong(dataId){
            var todo = AV.Object.createWithoutData('Song', dataId);
           return  todo.destroy().then(this.data={})
        }


    }

    let controller={
        init(view,model){
            this.view= view
            this.model=model
            this.view.render(this.model.data)
            this.bindEvents()
            this.bindeEventHub()
        },
        bindeEventHub(){
            //订阅事件
            window.eventHub.on('select',(data)=>{
                // console.log('data')         //选中进入编辑
                this.model.data = data
                this.view.render(this.model.data)
            })
            window.eventHub.on('new',(data)=>{   //新建清空表单
                if(this.model.data.id){
                    this.model.data={ }
                }else{
                    Object.assign(this.model.data,data)
                }
               this.view.render(this.model.data)
            })
            window.eventHub.on('newCover',(data)=>{
                Object.assign(this.model.data,data)
                this.view.render(this.model.data)
            })
        },
        bindEvents(){
            $(this.view.el).on('submit','form',(e)=>{
                e.preventDefault()
                let needs= 'name singer url coverUrl lyric'.split(' ')
                let data = {}
                needs.map((string)=>{
                    data[string] = $(this.view.el).find(`[name="${string}"]`).val()
                })
               if(this.model.data.id){
                   this.update(data)
               }else{
                   this.create(data)
               }
            })
            $(this.view.el).on('click','.deleteSong',(e)=>{
                e.preventDefault()
                if(this.model.data.id){
                    if(confirm("你确定要删除该歌曲吗？")){
                       this.model.deleteSong(this.model.data.id).then(()=>{
                           window.eventHub.emit('delete')
                           alert('删除成功')
                           this.view.reset()

                       })
                    }
                }

            })
        },

        create(data){
            this.model.create(data)  //执行保存到leancloud
                .then(()=>{
                    let string = JSON.stringify(this.model.data)
                    console.log('发布到歌单')
                    let object = JSON.parse(string)
                    window.eventHub.emit('create',object)
                    this.view.reset()
                    this.model.data={ }
                });
        },
        update(data){
              this.model.update(data)
                  .then(()=>{
                      console.log('更新成功')
                      console.log(data)
                      window.eventHub.emit('update',JSON.parse(JSON.stringify(this.model.data)))
                  })
        }
    }
    controller.init(view,model)

}