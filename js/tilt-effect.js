//originally https://codepen.io/tutsplus/pen/wzdKzQ
//Perspective Hover
(function() {
    $(document)
        .on("mousemove", "#item", function(e) {
            var angle = 15;
            var W = this.clientWidth;
            var H = this.clientHeight;

            var X = (e.offsetY- (W*0.5)) / W * -angle + 'deg';
            var Y = (e.offsetX - (H*0.5)) / H * angle + 'deg';

            $(this).css('transform', function() {
                return 'perspective( 800px ) translate3d( 0, -2px, 0 ) scale(1.02) rotateY(' + Y + ') rotateX(' + X + ')'
            });
        })
        .on("mouseout", "#item", function() {
            $(this).removeAttr('style')
        });
})();


// Scribble Text
function WordShuffler(holder,opt){
    var that = this;
    var time = 0;
    this.now;
    this.then = Date.now();
    this.currentTimeOffset = 0;

    this.word = null;
    this.currentWord = null;
    this.currentCharacter = 0;
    this.currentWordLength = 0;

    var options = {
        fps : 20,
        timeOffset : 1,
        textColor : '#000',
        mixSpecialCharacters : true,
        needUpdate : true,
        colors : [
            '#acacac','#666',
        ]
    }

    if(typeof opt != "undefined"){
        for(key in opt){
            options[key] = opt[key];
        }
    }

    this.needUpdate = true;
    this.fps = options.fps;
    this.interval =400/this.fps;
    this.timeOffset = options.timeOffset
    this.mixSpecialCharacters = options.mixSpecialCharacters;
    this.colors = options.colors;

    this.chars = [
        '인','간','의','욕',
        '심','은','끝','이',
        '없','고'
    ];
    this.specialCharacters = [
        '!','§','$','%',
        '&'
    ]

    if(this.mixSpecialCharacters){
        this.chars = this.chars.concat(this.specialCharacters);
    }

    this.getRandomColor = function () {
        var randNum = Math.floor( Math.random() * this.colors.length );
        return this.colors[randNum];
    }

    //if DOM
    if(typeof holder != "undefined"){
        this.holder = holder;
    }


    this.getRandCharacter = function(characterToReplace){
        if(characterToReplace == " "){
            return ' ';
        }
        var randNum = Math.floor(Math.random() * this.chars.length);
        var lowChoice =  -.1 + Math.random();
        var picketCharacter = this.chars[randNum];
        var choosen = picketCharacter.toLowerCase();

        return choosen;

    }

    this.writeWord = function(word){
        this.word = word;
        this.currentWord = word.split('');
        this.currentWordLength = this.currentWord.length;
    }

    this.generateSingleCharacter = function (color,character) {
        var span = document.createElement('span');
        span.style.color = color;
        span.innerHTML = character;
        return span;
    }

    this.updateCharacter = function (time) {

        this.now = Date.now();
        this.delta = this.now - this.then;


        if (this.delta > this.interval) {
            this.currentTimeOffset++;

            var word = [];

            if(this.currentTimeOffset === this.timeOffset && this.currentCharacter !== this.currentWordLength){
                this.currentCharacter++;
                this.currentTimeOffset = 0;
            }
            for(var k=0;k<this.currentCharacter;k++){
                word.push(this.currentWord[k]);
            }

            for(var i=0;i<this.currentWordLength - this.currentCharacter;i++){
                word.push(this.getRandCharacter(this.currentWord[this.currentCharacter+i]));
            }


            if(that.useCanvas){
                c.clearRect(0,0,stage.x * stage.dpr , stage.y * stage.dpr);
                var spacing = 0;
                word.forEach(function (w,index) {
                    if(index > that.currentCharacter){
                        c.fillStyle = that.getRandomColor();
                    }else{
                        c.fillStyle = that.textColor;
                    }
                    c.fillText(w, that.position.x + spacing, that.position.y);
                    spacing += c.measureText(w).width;
                });
            }else{

                if(that.currentCharacter === that.currentWordLength){
                    that.needUpdate = false;
                }
                this.holder.innerHTML = '';
                word.forEach(function (w,index) {
                    var color = null
                    if(index > that.currentCharacter){
                        color = that.getRandomColor();
                    }else{
                        color = that.textColor;
                    }
                    that.holder.appendChild(that.generateSingleCharacter(color, w));
                });
            }
            this.then = this.now - (this.delta % this.interval);
        }
    }


    function update(time) {
        time++;
        if(that.needUpdate){
            that.updateCharacter(time);
        }
        requestAnimationFrame(update);
    }

    this.writeWord(this.holder.innerHTML);


    console.log(this.currentWord);
    update(time);
}

var Type = new WordShuffler(title,{
    timeOffset : 2
});

$('.image-blur').blurryLoad();



