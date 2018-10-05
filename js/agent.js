function selectMove() {
    if (!PACMAN_DEAD && !GAMEOVER) { // make sure the game is running

        var directions = [];
        for (var i = 1; i < 5; i++) {
            if (canMovePacman(i)) directions.push(i);
        }

        if (directions.length > 2 || !PACMAN_MOVING) movePacman(directions[Math.floor(Math.random() * directions.length)]);
    }
};
