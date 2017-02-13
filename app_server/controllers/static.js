module.exports.homepage = function (req,res){
    res.render('homepage', {
        title:'Wargame Art',
        slogan: 'Best miniature painting service',
        buttonCaption: 'Order our service'
    });
};

module.exports.about = function (req,res){
    res.render('about', {
        title: 'about Wargame Art',
        content:[
            {
                title: 'A long time ago',
                text: 'Lorem ipsum nulla non proin: amet eu lorem molestie non adipiscing diam orci tempus in integer at orci. Donec porttitor odio ipsum elementum leo sodales enim eget vitae morbi elementum. Eu fusce morbi non tellus amet ligula, massa sagittis tempus ipsum. Integer, congue magna fusce congue, sagittis morbi auctor sapien ligula, gravida curabitur metus maecenas ut fusce at, lectus nulla at massa et, cursus pharetra at. Congue morbi tempus, massa cursus sapien diam et gravida et pellentesque urna magna congue nibh lorem pharetra cursus ligula adipiscing. Proin, eu diam magna eu cursus orci congue nam risus magna metus sed magna, curabitur mauris eros odio lectus. Nibh magna arcu duis arcu magna at, nec justo mauris in duis.'
            },
            {
                title: 'When the earth was green',
                text: 'ipsum nulla non proin: amet eu lorem molestie non adipiscing diam orci tempus in integer at orci. Donec porttitor odio ipsum elementum leo sodales enim eget vitae morbi elementum. Eu fusce morbi non tellus amet ligula, massa sagittis tempus ipsum. Integer, congue magna fusce congue, sagittis morbi auctor sapien ligula, gravida curabitur metus maecenas ut fusce at, lectus nulla at massa et, cursus pharetra at. Congue morbi tempus, massa cursus sapien diam et gravida et pellentesque urna magna congue nibh lorem pharetra cursus ligula adipiscing. Proin, eu diam magna eu cursus orci congue nam risus magna metus sed magna, curabitur mauris eros odio lectus. Nibh magna arcu duis arcu magna at, nec justo mauris in duis.'
            }
        ]
    });
};