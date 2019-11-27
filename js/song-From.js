{
    let view = {
        el:'.page > main',
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
                    外链  </label>
                    <input type="text" name="url" value="__url__">


            </div>
            <div class="row actions">
                <button type="submit">保存</button>
            </div>

        </form>
        `,
        render(data={}) {
            let placeholder = ['song', 'url', 'singer','id']
            let html = this.template
            placeholder.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
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
        data:{song:'',singer:'',url:'',id:''},
        create(data){
            var song = AV.Object.extend('Song');
            let Song = new song();
            Song.set({
                song:data.name,
                singer:data.singer,
                url:data.url,
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
            });
            return song.save().then((response)=>{
                let {id, attributes} = response
                Object.assign(this.data,{id,...attributes})
                return response
            },(error)=>{console.error(error)})
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
        },
        bindEvents(){
            $(this.view.el).on('submit','form',(e)=>{
                e.preventDefault()
                let needs= 'name singer url'.split(' ')
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
        },
        create(data){
            this.model.create(data)  //执行保存到leancloud
                .then(()=>{
                    let string = JSON.stringify(this.model.data)
                    console.log('发布到歌单')
                    let object = JSON.parse(string)
                    window.eventHub.emit('create',object)
                    this.view.reset()
                });
        },
        update(data){
              this.model.update(data)
                  .then(()=>{
                      console.log('更新成功')
                      window.eventHub.emit('update',JSON.parse(JSON.stringify(this.model.data)))
                  })
        }
    }
    controller.init(view,model)

}