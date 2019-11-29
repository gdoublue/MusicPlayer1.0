{
    let view= {
        el:'section.songs',
        template:`
          <a href="./player.html?id={{song.id}}">
          <li>
          <h3>{{song.song}}</h3>
          <p>
            <svg class="icon icon-sq">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-sq"></use>
            </svg>
            {{song.singer}}
          </p>
          <a class="playButton" href="./player.html?id={{song.id}}">
            <svg class="icon icon-play">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-play"></use>
            </svg>
          </a>
        </li>
        </a>
        `,
        init(){
            this.$el=$(this.el)
        },
        render(data){
            let {songs}=data
            songs.map((song)=>{
                let $li = $(this.template
                    .replace('{{song.song}}',song.song)
                    .replace('{{song.singer}}',song.singer)
                    .replace('{{song.id}}',song.id)

                )
                this.$el.find('ol.list').append($li)
            })
        }

    }
    let model={
        data:{
            songs:[]
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
            this.view.init()
            this.model.find().then(()=>{
                this.view.render(this.model.data)
            })
        }

    }
    controller.init(view,model)
}