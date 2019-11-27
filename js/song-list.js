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
            let{songs,selectedId} = data
            let list = songs.map((song)=>{
               let $li = $('<li></li>').text(song.song).attr('data-song-id',song.id)
                if(song.id===selectedId){$li.addClass('active')}
                return $li
            })
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
            songs:[ ],
            selectedId: undefined,
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
            this.bindEvents()
            this.bindeEventHub()
            this.model.find().then(()=>{
                this.view.render(this.model.data)
            })
            this.view.render(this.model.data)
        },
        bindEvents() {
            $(this.view.el).on('click','li',(e)=>{
                let SongId = e.currentTarget.getAttribute('data-song-id')
                this.model.data.selectedId = SongId
                this.view.render(this.model.data)
                let data
                let songs = this.model.data.songs
                for(let i=0;i<songs.length;i++){
                    if(songs[i].id === SongId){
                        data=songs[i]
                        break
                    }
                }
                // console.log(JSON.parse(JSON.stringify(data)))
                window.eventHub.emit('select', JSON.parse(JSON.stringify(data)))  //深拷贝
            })
        },
        bindeEventHub(){

            window.eventHub.on('create',(songData)=> {
                this.model.data.selectedId = ''
                this.model.data.songs.push(songData)        //push ,所以数据会叠加
                this.view.render(this.model.data)
            })
            window.eventHub.on('new',( )=>{
                this.model.data.selectedId = ''
                this.view.clearActive()
            })
            window.eventHub.on('update',(song)=>{
                let songs=this.model.data.songs
                for(let i=0;i<songs.length;i++){
                    if(songs[i].id===song.id){
                        Object.assign(songs[i]=song)
                    }
                }
                this.view.render(this.model.data)
                // console.log('更新列表')
                // console.log(this.model.data)
            })

        }
    }
   controller.init(view,model)
}