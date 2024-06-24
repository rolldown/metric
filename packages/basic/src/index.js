import { groupBy, last } from "lodash-es";

const list = [
  {
    name: "jack",
    age: 20
  }, 
  {
    name: "a",
    age: 30
  },
  {
    name: "b",
    age: 30
  }
]

groupBy(list, (item) => {
  last();
  return item.age
})
