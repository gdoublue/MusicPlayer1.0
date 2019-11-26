{
    let view={
        el:'.songlist-container',
        template:`
             <ul class="songlist">
          
        </ul>
        `,
        render(data){
            let $el = $(this.el)
            $el.html(this.template)
            let{songs} = data
            let list = songs.map((song)=>
            $('<li></li>').text(song.song))
            $el.find('ul').empty()
            list.map((domLi)=>{
                $el.find('ul').append(domLi)
            })
        },
        clearActive(){
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model={
        data:{
            songs:[ ]
        },
        find(){
            var querySongs = new AV.Query('Song')
            return querySongs.find().then((allSongs)=>{
             this.data.songs = allSongs.map((song)=>{
                return  {id:song.id , ...song.attributes}
             })
                return this.data.songs
            })
        }
    }
    let controller={
        init(view,model){
            this.view=view
            this.model=model
            this.view.render(this.model.data)
            window.eventHub.on('create',(songData)=> {

                this.model.data.songs.push(songData)        //push ,所以数据会叠加
                this.view.render(this.model.data)
            })
            this.model.find().then(()=>{
                this.view.render(this.model.data)
            })
        }
    }
   controller.init(view,model)
}