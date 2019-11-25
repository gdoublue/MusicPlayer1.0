{
    let view={
        el:'.songlist-container',
        template:`
             <ul class="songlist">
            <li> 歌曲 1</li>
            <li class="active"> 歌曲 2</li>
            <li> 歌曲 3</li>
            <li> 歌曲 4</li>
            <li> 歌曲 5</li>
            <li> 歌曲 6</li>
            <li> 歌曲 7</li>
        </ul>
        `,
        render(data){
            $(this.el).html(this.template)
        }
    }
    let model={}
    let controller={
        init(view,model){
            this.view=view
            this.model=model
            this.view.render(this.model.data)
        }
    }
   controller.init(view,model)
}