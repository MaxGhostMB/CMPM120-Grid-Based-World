class Start extends Scene {
    enter() {
        this.engine.setTitle(this.engine.storyData.title);
        this.engine.addNavigationCell("Begin the story");
    }

    handleNavigation() {
        var start = this.engine.storyData.start;
        this.engine.gotoScene(Room, start.x, start.y, {"items": {}, "steps": 0,});
    }
}

class Room extends Scene {
    enter(x,y,player) {
        this.x = x;
        this.y = y;

        var roomData = this.engine.storyData.rooms[x + "_" + y];
        this.engine.showCaption(roomData.name);
        this.engine.show(roomData.description);
        this.interactions(player.items, roomData);
        player.steps += 1;
        if (roomData.items.length > 0) {
            var items = "Items collected: ";
            for(var item of roomData.items) {
                items += this.engine.itemString(item) + ", ";
                if (player.items[item]) {
                    player.items[item] += 1;
                }
                else {
                    player.items[item] = 1;
                }
            }
            roomData.items = [];
            this.engine.show(items);
        } else {
            this.engine.show("No items left to collect.");
        }

        if (this.engine.storyData.exit.x == x && this.engine.storyData.exit.y == y) {
            this.endGame(player);
        } else {
            var room_;
            // TODO: remove this
            // this.engine.addInteraction("Do something", "x", "y");

            // navigation cells come in a 3x3 grid
            // row 1
            this.engine.addTextCell();
            if (this.engine.storyData.rooms[x+"_"+(y-1)]) {
                if (this.canEnterRoom(player, this.engine.storyData.rooms[x+"_"+(y-1)])) {
                    this.engine.addNavigationCell("Go North", x, y-1, player);
                } else {
                    this.engine.addInactiveNavigationCell("Go North", x, y-1, player, this.engine.storyData.rooms[x+"_"+(y-1)])
                }   
            } else {
                this.engine.addTextCell();
            }
            this.engine.addTextCell();

            // row 2
            if (this.engine.storyData.rooms[(x-1)+"_"+y]) {
                if (this.canEnterRoom(player, this.engine.storyData.rooms[(x-1)+"_"+y])) {
                    this.engine.addNavigationCell("Go West", x-1, y, player);
                } else {
                    this.engine.addInactiveNavigationCell("Go West", x-1, y, player, this.engine.storyData.rooms[(x-1)+"_"+y])
                }
            } else {
                this.engine.addTextCell();
            }
            this.engine.addTextCell("You are here");
            if (this.engine.storyData.rooms[(x+1)+"_"+y]) {
                if (this.canEnterRoom(player, this.engine.storyData.rooms[(x+1)+"_"+y])) {
                    this.engine.addNavigationCell("Go East", x+1, y, player);
                } else {
                    this.engine.addInactiveNavigationCell("Go East", x+1, y, player, this.engine.storyData.rooms[(x+1)+"_"+y])
                }
            } else {
                this.engine.addTextCell();
            }

            // row 3
            this.engine.addTextCell();
            if (this.engine.storyData.rooms[x+"_"+(y+1)]) {
                if (this.canEnterRoom(player, this.engine.storyData.rooms[x+"_"+(y+1)])) {
                    this.engine.addNavigationCell("Go South", x, y+1, player);
                } else {
                    this.engine.addInactiveNavigationCell("Go South", x, y+1, player, this.engine.storyData.rooms[x+"_"+(y+1)])
                }   
            } else {
                this.engine.addTextCell();
            }
            this.engine.addTextCell();
        }
        this.engine.transition();
    }

    canEnterRoom(player, roomData) {
        if (!roomData.requires) return true;
        for (let req of roomData.requires) {
            if (!player.items || !player.items[req]) {
                return false;
            }
        }
        return true;
    }

    handleNavigation(x,y,player) {
        this.engine.gotoScene(Room, x, y, player);
    }

    handleInactiveNavigation(x, y, player, roomData) {
        var req_string = ""
        var item_needed = 0
        for (let req of roomData.requires) {
            req_string = req_string + req;
            if (!player.items || !player.items[req]) {
                if (req == "sawdust") {
                    this.engine.show( "you need to knaw your way through this way, but the wall is too thick to without a tool, maybe a nail could help");
                } 
            } else {
                item_needed += 1;
            }
        }
        console.log(roomData.requires.length);
        this.engine.show(req_string + " is needed to enter this room"); 
        if (item_needed == roomData.requires.length) {
            return true;
            // this.engine.gotoScene(Room, x, y, player);
        }
        return false;
    }
    

    handleInteraction(a,b, inventory, roomData) {
        // a, b are inputs that are passed when button is clicked
        // butons are made (and their inputs are assigned) with addInteraction(str, a, b);
        // so, a could be "cat" and b could be "laserpointer" and you'd have a case here like
        // if (a && b) play with cat

        if (a == "1" && b == "0") {
            this.engine.show("There is a weak spot in the wall across a maze of nails");
            this.engine.addInteraction("attempt to cross", "1.1", "0.1", inventory);
            this.engine.addExlusiveInteraction("use paper", "1.2", "0.2", inventory);
        } 
        if (a == "1.1" && b == "0.1") {
            this.engine.show("you run through the maze of nails, you get clipped by one and you get hurt. you loose some points");
            if (inventory["scratch"]) {
                inventory["scratch"] += 1;
            } else {
                inventory["scratch"] = 1;
            }
        }
        if (a == "1.2" && b == "0.2") {
            this.engine.show("you use some nesting paper to bundle around yourself and you run through the maze of nails, you clip one and it rips the paper off of you, but you are okay! your at the soft spot on the wall")
            this.engine.addExlusiveInteraction("knaw through", "knaw", "wall", inventory);
        }
        if (a == "knaw" && b == "wall") {
            this.engine.show("you knaw through the wall, you collect some sawdust");
            if (inventory["sawdust"]) {
                inventory["sawdust"] += 1;
            } else {
                inventory["sawdust"] = 1;
            }
        }
        if (a == "1" && b == "1") {
            this.engine.show("you spot some crumbs, you follow them the path forks");
            this.engine.addExlusiveInteraction("track down food to the right", "1.1", "1.1", inventory);
            this.engine.addExlusiveInteraction("track down food to left", "1.2", "1.2", inventory);
        }
        if (a == "1.1" && b == "1.1") {
            this.engine.show("as you track down where the came from you find a cookie");
            if (inventory["cookie"]) {
                inventory["cookie"] += 1;
            } else {
                inventory["cookie"] = 1;
            }
        }
        if (a == "1.2" && b == "1.2") {
            this.engine.show("as you track down where the crumbs came from without paying attention to your suroundings and you suddenly bump into something furry, you slowly look up to see a cat! You should really flee ");
            if (inventory["scratch"]) {
                inventory["scratch"] += 1;
            } else {
                inventory["scratch"] = 1;
            }
        }
        if (a == "2" && b == "2") {
            this.engine.show("You spot the cat! what can you do you hide from it");
            this.engine.addExlusiveInteraction("cover yourself with the newspaper", "2.1", "2.1", inventory, roomData);
        }
        if (a == "2.1" && b == "2.1") {
            this.engine.show("you're a bit more protected but the cat is still there!");
            this.engine.addExlusiveInteraction("run left", "2.1.1", "2.1.1", inventory);
            this.engine.addExlusiveInteraction("run right", "2.1.2", "2.1.2", inventory, roomData);
        }
        if (a == "2.1.1" && b == "2.1.1") {
            this.engine.show("you run away, it's a bit hard to see so you run into a wall");
            if (inventory["scratch"]) {
                inventory["scratch"] += 1;
            } else {
                inventory["scratch"] = 1;
            }
            if (inventory["yarn"]) {
                inventory["yarn"] += 1;
            } else {
                inventory["yarn"] = 1;
            }
        }
        if (a == "2.1.2" && b == "2.1.2") {
            this.engine.show("you run, and run, and run") 
            if (inventory["yarn"]) {
                inventory["yarn"] += 1;
            } else {
                inventory["yarn"] = 1;
            }
            
        }
 
    }

    interactions(inventory, roomData) {
        // this is called when you enter the room, before collecting items
        // you could setup interaction logic here
        var roomItems = roomData.items;

        if ((inventory["paper"] >= 1 && roomItems.includes("nail")) || (!inventory["sawdust"] && roomData.name == "Between The Wall")) {
            this.engine.addInteraction("Getting accross", "1", "0", inventory);
        }
        if (inventory["sawdust"] >= 1 && roomItems.includes("crumbs")) {
            this.engine.addInteraction("Find the source of the crumbs", "1", "1", inventory);
        } 
        if (inventory["newspaper"] >=1 && roomItems.includes("cat2")) {
            this.engine.addInteraction("Hide from the cat", "2", "2", inventory ,roomData);
        }
        
    }

    endGame(player) {
        var points = 0;
        var point_giver = ["crumbs", "cookie", "ice cube", "broccoli", "pie", "pretzel"]; 

        this.engine.show("You have reached the exit! Congratulations!");
        var items = "Items collected:";
        for(var item in player.items) {
            items += this.engine.itemString(item) + " x" + player.items[item] + " ";
            if (point_giver.includes(item)) {
                points += 10 * player.items[item];
            }
            if (item == "scratch") {
                points -= 10 * player.items["scratch"];
            } 
        }

        this.engine.show(items);
        this.engine.show("Total steps taken: " + player.steps);
        let score = Object.keys(player.items).length /player.steps + points;
        this.engine.show("Your score is: " + score);
        this.engine.show(this.engine.storyData.credits);
    }
}

Engine.load(Start, './myWorld-copy.json');