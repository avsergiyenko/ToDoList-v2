const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useUnifiedTopology: true, 
  useNewUrlParser: true, 
  useFindAndModify: false
});

const itemsSchema = ({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your to do List"
});

const item2 = new Item({
  name: "Hit the + button to add a new item."
});

const item3 = new Item ({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];


app.get("/", (req, res) => {

  Item.find({}, (err, foundItems) => {

    if(foundItems.length === 0){
      
      Item.insertMany(defaultItems, (err) => {
        if(err) {
          console.log(err);
        } else {
          console.log ("Succesfully added items!");
        }
        res.redirect("/");
      });
    } else {

      res.render("list", {listTitle: "Today", newListItems: foundItems});

    }    

  });  

});


app.post("/", (req, res) => {

  const itemName = req.body.newItem;  
  const item4 = new Item({
    name: itemName
  });

  item4.save();
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const itemId = req.body.checkbox;

  Item.findByIdAndRemove(itemId, (err) => {
    if(err) {
      console.log(err);
    } else {
      console.log("Item successfully removed!");
    }
    res.redirect("/");
  })
});

app.get("/work", (req,res) => {
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
