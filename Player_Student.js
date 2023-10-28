///\/\/\\\/\/\//\\///\//\\\///////\/\/\\\/\/\//\\///\//\\\//////
//
//  Assignment       COMP3200 - Assignment 3
//  Professor:       David Churchill
//  Year / Term:     2023-09
//  File Name:       Player_Student.js
// 
//  Student Name:    Arnob Ghosh
//  Student User:    arnobg
//  Student Email:   arnobg@mun.ca
//  Student ID:      202136073
//  Group Member(s): [enter student name(s)]
//
///\/\/\\\/\/\//\\///\//\\\///////\/\/\\\/\/\//\\///\//\\\//////
       
// Player_Student.js 
// Computer Science 3200 - Assignment 3
// Author(s): David Churchill [replace with your name(s)]
//
// All of your Assignment code should be in this file, it is the only file submitted.
// You may create additional functions / member variables within this class, but do not
// rename any of the existing variables or function names, since they are used by the
// GUI to perform specific functions.

class Player_Student {
    
    constructor(config) {
        this.config = config;
        this.searchStartTime = 0;

        this.bestAction         = null;
        this.currentBestAction  = null;
        this.currentMaxDepth    = null;
        this.maxPlayer          = null;

        console.log("Student AB Player");
        console.log("  Time Limit: ", this.config.timeLimit);
        console.log("  Max  Depth: ", this.config.maxDepth);
    }
       
    // Function which is called by the GUI to get the action
    getAction(state) {
        return this.IDAlphaBeta(state);
    }

  
    IDAlphaBeta(state) {
        // here is the syntax to record the time in javascript
        this.searchStartTime = performance.now();
        this.bestAction = null;
        this.maxPlayer = state.player;
        console.log(state.player);
        for(let d=0; d<=this.config.maxDepth; d++){
            console.log("trying1");
            this.currentMaxDepth = d;
            try{
                console.log("trying2");
                console.log(this.currentBestAction);
                let val = this.AlphaBeta(state, -10000000, 10000000, 0, true);
                this.bestAction = this.currentBestAction;
                console.log(this.currentBestAction, val);
            }
            catch(TimeOutException){
                console.log("exception");
                break;
            }
        }
        return this.bestAction;
    }

    // Student TODO: Implement this function
    //
    // This funtion should implement MiniMax with Alpha-Beta Pruning. It is recommended
    // to first get vanilla MiniMax search working properly before implementing the Alpha
    // Beta pruning enhancement. 
    //
    // Please be aware that this function does not return an action - it returns a state value.
    // Actions must be set to a class member variable, rather than returned. 
    //
    // It is important that you COPY states [via state.copy()] before generating children,
    // otherwise you will be modifying reference to states on different levels of recursion.
    //
    // (There is a fun optimization you can do that doesn't require copying! Try to find it)
    //
    //
    // Args:
    //    state        : the state for the current node in the search tree
    //    alpha (int)  : the current alpha value of the search
    //    beta  (int)  : the current beta value of the search
    //    depth (int)  : the current depth of the search
    //    max (bool)   : whether the current player is maximizing or not
    //
    // Returns:
    //    value (int)  : the value of the state
    //
    AlphaBeta(state, alpha, beta, depth, max) {

        // code for AlphaBeta goes here

        // here is the syntax to calculate how much time has elapsed since the search began
        // you should compare this to this.config.timeLimit and throw an error if time up
        let timeElapsed = performance.now()-this.searchStartTime;
        if(timeElapsed>this.config.timeLimit){
            throw TimeOutException;
        }

        if(depth>this.currentMaxDepth || state.winner() == state.player || state.winner() == (state.player+1)%2){
            return this.eval(state,this.maxPlayer);
        }
        
        if(max){
            console.log('in max');
            let actions = state.getLegalActions();
            console.log(actions);
            let max = -10000000;
            for(let a=0; a<actions.length; a++){
                let child = state.copy();
                child.doAction(actions[a]);
                let value = this.AlphaBeta(child, alpha, beta, depth+1, false);
                console.log(value, max);
                if(depth==0){console.log('value', a, value);}
                if(value > max){
                    console.log("v greater than max");
                    max = value;
                    if(depth==0){this.currentBestAction = actions[a];}

                }
                if(value>=beta){
                    return max;
                }
                if(value>alpha){
                    alpha = value;
                }
            }
            return max;
        }
        else{
            let actions = state.getLegalActions();
            let min=10000000;
            for(let a=0; a<actions.length; a++){
                let child = state.copy();
                child.doAction(actions[a]);
                let value = this.AlphaBeta(child, alpha, beta, depth+1, true);
                if(value < min){
                    min=value;
                }
                if(value<=alpha){
                    return min;
                }
                if(value<beta){
                    beta = value;
                }
            }
            return min;
        }
    }

    

    // This function is basically what I understood from the strategy the professor shared with us.
    checkPossibility(x, y, dir, connect, player, state) {
        let p = player;
        if (state.get(x, y) == (p+1)%2) {return false;}
        let cx = x, cy = y;
        let windowscore=1; let atLeastOne = false;
        if(state.get(cx, cy) == p){atLeastOne=true;}
        for (let c=0; c<connect-1; c++) {
            cx += dir[0]; cy += dir[1];
            if (!state.isValid(cx, cy)) { return false; }
            if (state.get(cx, cy) != (p+1)%2) { windowscore+=1; }
            if(state.get(cx, cy) == p){atLeastOne=true;}
        }
        if(windowscore == connect && atLeastOne){return true};
        return false;
    }
    // There is no inspiration of the idea behind this function because I am just saying that it is better to have your dots clustered (connected) to each other
    check2(x, y, dir, connect, player, state) {
        let p = player;
        if (state.get(x, y) != p) {return false;}
        let cx = x, cy = y;
        for (let c=0; c<connect-1; c++) {
            cx += dir[0]; cy += dir[1];
            if (!state.isValid(cx, cy)) { return false; }
            if (state.get(cx, cy) != p) {return false;}
            if (state.get(cx, cy) == p) { return true; }
        }
        
        return false;
    }
    // Again, no source for this idea, but when you are trying to cluster your dots, your cluster might be of any shape.
    // So try to make a linear connection
    check3(x, y, dir, connect, player, state) {
        let p = player; let three;
        if (state.get(x, y) == p) {three =1;}
        if (state.get(x, y) != p) {three =0;}
        let cx = x, cy = y;
        for (let c=0; c<connect-1; c++) {
            cx += dir[0]; cy += dir[1];
            if (!state.isValid(cx, cy)) { return false; }
            if (state.get(cx, cy) != p) {return false;}
            if (state.get(cx, cy) == p) { three +=1; }
        }
        if(three == 3){
            return true;}
    }
    eval(state, player) {
        let winner = state.winner();
        if      (winner == player)              { return 10000; }   // win, return large#
        else if (winner == (player + 1) % 2)    { return -10000; }  // loss, return -large#
        else if (winner == PLAYER_DRAW)         { return 0; }       // draw, return 0
        else if (winner == PLAYER_NONE) {   
            let score = 0;

            for (let d=0; d<state.dirs.length; d++) {
                // Check to see if there's a win in that direction from every place on the board
                for (let x=0; x<state.width; x++) {
                    for (let y=0; y<state.height; y++) {
                        //console.log("Possible?", this.checkPossibility(x, y, state.dirs[d], state.connect, player, state), x, y);
                        if(this.checkPossibility(x, y, state.dirs[d], state.connect, player, state)){
                            score+=1;
                        }
                        
                        if(this.check2(x, y, state.dirs[d], state.connect, player, state)){
                            score+=20;
                        }

                        if(this.check3(x, y, state.dirs[d], state.connect, player, state)){
                            score+=30;
                        }

                    }
                }

            }

            console.log("score", score);
            // where your custom computed heuristic should go
            // it should be between large# and -large#

            return score; 

        }
    }

}
       
// Copyright (C) David Churchill - All Rights Reserved
// COMP3200 - 2023-09 - Assignment 3
// Written by David Churchill (dave.churchill@gmail.com)
// Unauthorized copying of these files are strictly prohibited
// Distributed only for course work at Memorial University
// If you see this file online please contact email above
