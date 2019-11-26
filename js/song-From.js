{
    let view = {
        el:'.page > main',
        init(){
            this.$el=$(this.el)
        },
        template:`
            <h1>新建歌曲</h1>
        <form class="form">
            <div class="row">
                <label>
                    歌名</label>
                    <input type="text" name="name" value="__name__">

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
            let placeholder = ['name', 'url', 'singer','id']
            let html = this.template
            placeholder.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
        },
        reset() {
            this.render({})

        }
    }

    let model={
        data:{name:'',singer:'',url:'',id:''},
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
        }

    }

    let controller={
        init(view,model){
            this.view= view
            this.model=model
            this.view.render(this.model.data)
            this.bindEvents()
            //订阅上传完成事件
            window.eventHub.on('upload',(data)=>{
                this.model.data = data
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
                this.model.create(data)  //执行保存到leancloud
                    .then(()=>{
                        this.view.reset()
                        let string = JSON.stringify(this.model.data)
                        console.log('发布到歌单')
                        let object = JSON.parse(string)
                        window.eventHub.emit('create',object)
                    });
            })
        }
    }
    controller.init(view,model)

}