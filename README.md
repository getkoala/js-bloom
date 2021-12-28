# Serialisable (JSON) Bloom Filter

A bloom filter implementation that is serialisable to JSON and compatible between both Ruby and Javascript. Very useful when needing to train a bloom filter in one language and using it in the other.

## Why?

Bloom filters allow for space efficient lookups in a list, without having to store all the items in the list. This is useful for looking up tags, domain names, links, or anything else that you might want to do client side.

What this Gem allows you to do is build a bloom filter server side, add all your entries to it, and then serialise the filter to JSON. On the client side you can then load up the serialised data into the Javascript version and use the bloom filter as is.

All of this while not sending the entire list to the client, which is something you might not want to do for either security or efficiency reasons.

## Usage

### Ruby

```ruby
require "json-bloomfilter"

# use the factory to configure the filter
filter =  JsonBloomFilter.build 10000, 0.01 # number of expected items, desired error rate

# or create a define the BloomFilter manually
filter = JsonBloomFilter.new size: 100

# and add entries
filter.add "foo"
filter.add "bar"
# alternatively
filter.add ["foo", "bar"]
# test the entries
filter.test "foo" #=> true
filter.test "bar" #=> true
filter.test "doh" #=> probably false

# export the filter to a hash or json
filter.to_json #=> hash as JSON
config = filter.to_hash #=> { "size" => 100, "hashes" => 4, "seed" => 1234567890, "bits" => [...] }

# use the hash to generate a new filter with the same config
filter2 = JsonBloomFilter.new config
filter2.test "foo" #=> true
filter2.test "bar" #=> true
filter2.test "doh" #=> probably false
```

### Javascript

```javascript
import { JsonBloomFilter } from "json-bloom-filter";

// use the factory to configure the filter
let filter = JsonBloomFilter.build(10000, 0.01); // number of expected items, desired error rate

// or create a define the filter manually
let filter = new JsonBloomFilter({ size: 100 });

// and add entries
filter.add("foo");
filter.add("bar");
// alternatively
filter.add(["foo", "bar"]);
// test the entries
filter.test("foo"); //=> true
filter.test("bar"); //=> true
filter.test("doh"); //=> probably false

// export the filter to a hash or json
filter.toJson(); //=> hash as JSON
config = filter.toHash(); //=> { "size" => 100, "hashes" => 4, "seed" => 1234567890, "bits" => [...] }

// use the hash to generate a new BloomFilter with the same config
filter2 = new JsonBloomFilter(config);
filter2.test("foo"); //=> true
filter2.test("bar"); //=> true
filter2.test("doh"); //=> probably false
```

### Options

Valid options for constructor are:

- `size` (default: 100), the bit size of the bit array used
- `hashes` (default: 4), the number of hashes used to calculate the bit positions in the bit field
- `seed` (default: current UNIX time), the seed for the hashing method

Additionally you can pass along:

- `bits` (default: null), an array with the bitfield in non-bit format. Use `#to_hash` to create these for your active BloomFilter.
