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

    // Student TODO: Implement this function
    //
    // This funtion should implement Iterative Deepening Alpha Beta (IDAB). It should call the
    // separate AlphaBeta function which implements the MiniMax search with Alpha Beta pruning.
    // This function should use the this.config configuration options for the following:
    // 
    //     config.timeLimit - search time limit in milliseconds
    //                      - timeLimit of 0 means there is no time limit
    //     config.maxDepth  - maximum depth for IDAB  (depth > maxDepth) = eval()
    //                      - maxDepth of 0 means no max depth
    //
    //     You can assume one of timeLimit or maxDepth will always be greater than 0
    //
    // Please note that both of these limits should be used, and whichever one happens first
    // should be the stopping condition.
    //
    // Be sure to return the best action from the last COMPLETED AlphaBeta search.
    //
    // Args:
    //    state        : the state for which to find the best action for the player to move
    //
    // Returns:
    //    action (int) : the best action for the player to move
    //
    IDAlphaBeta(state) {
        // here is the syntax to record the time in javascript
        this.searchStartTime = performance.now();

        this.bestAction = null;
        this.maxPlayer = state.player;
        for(let d=0; d<this.config.maxDepth; d++){
            console.log("trying1");
            this.currentMaxDepth = d;
            try{
                console.log("trying2");
                console.log(this.currentBestAction);
                this.AlphaBeta(state, -10000000, 10000000, 0, true);
                this.bestAction = this.currentBestAction;
                console.log(this.currentBestAction);
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
        console.log("time elapsed", timeElapsed);
        if(timeElapsed>this.config.timeLimit){
            console.log("Out of limit");
            throw TimeOutException;
        }

        if(depth>this.currentMaxDepth){
            return this.eval(state,state.player);
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
                if(value > max){
                    console.log("v greater than max");
                    max = value;
                    if(depth==0){this.currentBestAction = actions[a];}

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
            }
            return min;
        }
    }

    
    // Student TODO: Implement this function
    //
    // This funtion should compute a heuristic evaluation of a given state for a given player.
    // It should return a large positive value for a 'good' state for the player, and a large
    // negative value for a 'bad' state for the player. Assign the maximum possible values to
    // winning and losing states, and be sure to assign values in between for states of a game
    // in progress. 
    //
    // This is one of the most important factors in your program performing well in the
    // class competition - poor heursitic functions cannot always be saved by good search.
    //
    // NOTE: Be sure to pass the player variable into this function, JS will not throw any
    //       error if you call it with just the state, which will lead to odd behavior.
    //       Most of the time, you will want to call this with player = this.maxPlayer
    //
    // Args:
    //    state        : the state to evaluate
    //    player       : the player to evaluate the state for
    //
    // Returns:
    //    value (int)  : the heuristic evaluation of the state
    //
    eval(state, player) {
        let winner = state.winner();
        if      (winner == player)              { return 10000; }   // win, return large#
        else if (winner == (player + 1) % 2)    { return -10000; }  // loss, return -large#
        else if (winner == PLAYER_DRAW)         { return 0; }       // draw, return 0
        else if (winner == PLAYER_NONE) {   
            
            // where your custom computed heuristic should go
            // it should be between large# and -large#
            return 0; 
        }
    }

}
       
// Copyright (C) David Churchill - All Rights Reserved
// COMP3200 - 2023-09 - Assignment 3
// Written by David Churchill (dave.churchill@gmail.com)
// Unauthorized copying of these files are strictly prohibited
// Distributed only for course work at Memorial University
// If you see this file online please contact email above
