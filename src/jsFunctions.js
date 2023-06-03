export function objectsAreEqual(object1, object2){
  if(object1 && object2) {
    let flag = true
    for (const key in object1) {
      if (Object.hasOwnProperty.call(object1, key)) {
        const val1 = object1[key];
        const val2 = object2[key];
        if (val1 !== val2) flag = false
      }
    }
    return flag
  } else {
    return false
  }
};