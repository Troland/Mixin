// 哈希表
/**
 * Simple hash map class.
 */
var HashMap = function() {
  this._size = 0;
  this._map = {};
};

HashMap.prototype = {

  /**
   * Puts the key/value pair into the map, overwriting
   * any existing entry.
   */
  put: function(key, value) {
    if (!this.containsKey(key)) {
      this._size++;
    }
    this._map[key] = value;
  },
  
  /**
   * Removes the entry associated with the key
   * and returns the removed value.
   */
  remove: function(key) {
    if (this.containsKey(key)) {
      this._size--;
      var value = this._map[key];
      delete this._map[key];
      return value;
    } else {
      return null;
    }
  },
  
  /**
   * Checks if this map contains the given key.
   */
  containsKey: function(key) {
    return this._map.hasOwnProperty(key);
  },
  
  /**
   * Checks if this map contains the given value.
   * Note that values are not required to be unique.
   */
  containsValue: function(value) {
    for (var key in this._map) {
      if (this._map.hasOwnProperty(key)) {
        if (this._map[key] === value) {
          return true;
        }
      }
    }

    return false;
  },
  
  /**
   * Returns the value associated with the given key.
   */
  get: function(key) {
    return this.containsKey(key) ? this._map[key] : null;
  },
  
  /**
   * Clears all entries from the map.
   */
  clear: function() {
    this._size = 0;
    this._map = {};
  },
  
  /**
   * Returns an array of all keys in the map.
   */
  keys: function() {
    var keys = [];
    for (var key in this._map) {
      if (this._map.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
    return keys;
  },
  
  /**
   * Returns an array of all values in the map.
   */
  values: function() {
    var values = [];
    for (var key in this._map) {
      if (this._map.hasOwnProperty(key)) {
        values.push(this._map[key]);
      }
    }
    return values;
  },
  
  /**
   * Returns the size of the map, which is
   * the number of keys.
   */
  size: function() {
    return this._size;
  }
};
/**
 * Constructor that initializes the parent HashMap
 * and the doubly linked list head and tail.
 */
var LinkedHashMap = function() {
  // invoke super constructor
  HashMap.apply(this, arguments);

  // "inner" Entry class
  this._Entry = function(value) {
    this.prev = null;
    this.next = null;
    this.value = value;
  };

  // doubly linkedlist instance variables
  this._head = this._tail = null;
};

// extend HashMap and overwrite the necessary functions
var temp = function() {};
temp.prototype = HashMap.prototype;
LinkedHashMap.prototype = new temp();

/**
 * Puts the key/value pair in the HashMap and records
 * the insertion record if it does not exist.
 * 
 * @override HashMap.put()
 */
LinkedHashMap.prototype.put = function(key, value) {
  var entry = new this._Entry(key);

  if (!this.containsKey(key)) {
    if (this.size() === 0) {
      this._head = entry;
      this._tail = entry;
    } else {
      this._tail.next = entry;
      entry.prev = this._tail;
      this._tail = entry;
    }
  }

  /*
   * EDIT: Added optimization suggested
   * by Chad Walker (see article comments).
   */
  // overwrite the value with an optimized Object wrapper
  value = {value:value, entry:entry};

  HashMap.prototype.put.call(this, key, value);
};

/**
 * Returns the value associated with the key.
 * 
 * @override HashMap.get()
 */
LinkedHashMap.prototype.get = function(key){
  var value = HashMap.prototype.get.call(this, key);
  
  /*
   * EDIT: Added optimization suggested 
   * by Chad Walker (see article comments).
   */  
  // we must unwrap the value
  return value != null ? value.value : null;
};

/**
 * Removes the key/value pair from the map and 
 * the key from the insertion order.
 * 
 * @override Hashmap.remove()
 */
LinkedHashMap.prototype.remove = function(key) {

  /*
   * EDIT: Added optimization suggested 
   * by Chad Walker (see article comments).
   */
  var value = HashMap.prototype.remove.apply(this, arguments);

  if (value != null) {
  
    var entry = value.entry;
  
    if (entry === this._head) {
      this._head = entry.next;
      this._head.prev = null;
    } else if (entry === this._tail) {
      this._tail = entry.prev;
      this._tail.next = null;
    } else {
      entry.prev.next = entry.next;
      entry.next.prev = entry.prev;
    }
  }

  return value;
};

/**
 * Clears the HashMap and insertion order.
 *
 * @override HashMap.clear()
 */
LinkedHashMap.prototype.clear = function() {
  HashMap.prototype.clear.apply(this, arguments);
  this._head = this._tail = null;
};

/**
 * Returns the HashMap keys in insertion order.
 *
 * @override HashMap.keys()
 */
LinkedHashMap.prototype.keys = function() {
  var keys = [];
  for (var cur = this._head; cur != null; cur = cur.next) {
    keys.push(cur.value);
  }
  return keys;
};

/**
 * Returns the HashMap values in insertion order.
 * 
 * @override HashMap.values()
 */
LinkedHashMap.prototype.values = function() {
  var values = [];
  for (var cur = this._head; cur != null; cur = cur.next) {
    values.push(this.get(cur.value));
  }
  return values;
};