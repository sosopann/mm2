import type { Product, Category, Rarity } from "@shared/schema";

// Helper to generate product ID from name
function generateId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
}

// All MM2 products with Egyptian pound pricing
export const allProducts: Product[] = [
  // BUDGET ITEMS - 17 EGP
  { id: generateId("Blue Elite"), name: "Blue Elite", price: 17, category: "Budget", rarity: "Common", description: "A sleek blue elite knife with sharp edges.", inStock: 1 },
  { id: generateId("Green Elite"), name: "Green Elite", price: 17, category: "Budget", rarity: "Common", description: "A vibrant green elite knife.", inStock: 1 },
  { id: generateId("Skool"), name: "Skool", price: 17, category: "Budget", rarity: "Common", description: "Classic school-themed knife design.", inStock: 1 },
  { id: generateId("Blossom"), name: "Blossom", price: 17, category: "Budget", rarity: "Common", description: "Beautiful floral blossom knife.", inStock: 1 },
  { id: generateId("Hallows Blade"), name: "Hallows Blade", price: 17, category: "Budget", rarity: "Uncommon", description: "Spooky Halloween-themed blade.", inStock: 1 },
  { id: generateId("Ornament2 Gun"), name: "Ornament2 Gun", price: 17, category: "Budget", rarity: "Common", description: "Festive ornament-styled gun.", inStock: 1 },
  { id: generateId("Santa Gun"), name: "Santa Gun", price: 17, category: "Budget", rarity: "Uncommon", description: "Christmas Santa-themed gun.", inStock: 1 },
  { id: generateId("Ginger Gun"), name: "Ginger Gun", price: 17, category: "Budget", rarity: "Common", description: "Sweet gingerbread gun design.", inStock: 1 },
  { id: generateId("Rupture"), name: "Rupture", price: 17, category: "Budget", rarity: "Uncommon", description: "Powerful rupture effect gun.", inStock: 1 },
  { id: generateId("Tree Gun"), name: "Tree Gun", price: 17, category: "Budget", rarity: "Common", description: "Nature-themed tree gun.", inStock: 1 },
  { id: generateId("Ornament Gun"), name: "Ornament Gun", price: 17, category: "Budget", rarity: "Common", description: "Classic ornament gun design.", inStock: 1 },
  { id: generateId("Cavern Gun"), name: "Cavern Gun", price: 17, category: "Budget", rarity: "Uncommon", description: "Dark cavern-styled gun.", inStock: 1 },
  { id: generateId("Xmas Gifts"), name: "Xmas Gifts", price: 17, category: "Budget", rarity: "Common", description: "Festive Christmas gifts bundle.", inStock: 1 },
  { id: generateId("Pengy"), name: "Pengy", price: 17, category: "Budget", rarity: "Common", description: "Adorable penguin pet.", inStock: 1 },
  { id: generateId("UFO"), name: "UFO", price: 17, category: "Budget", rarity: "Rare", description: "Mysterious UFO pet.", inStock: 1 },
  { id: generateId("Rudolph"), name: "Rudolph", price: 17, category: "Budget", rarity: "Common", description: "Classic Rudolph reindeer pet.", inStock: 1 },
  { id: generateId("Reindeer"), name: "Reindeer", price: 17, category: "Budget", rarity: "Common", description: "Festive reindeer pet.", inStock: 1 },
  { id: generateId("Chilly"), name: "Chilly", price: 17, category: "Budget", rarity: "Common", description: "Cool icy chilly pet.", inStock: 1 },
  { id: generateId("Mystery Key"), name: "Mystery Key", price: 17, category: "Budget", rarity: "Rare", description: "Unlock mysterious rewards.", inStock: 1 },
  { id: generateId("Box Of Fert"), name: "Box Of Fert", price: 17, category: "Budget", rarity: "Common", description: "Special fertilizer box.", inStock: 1 },
  { id: generateId("Scarecrow"), name: "Scarecrow", price: 17, category: "Budget", rarity: "Uncommon", description: "Spooky scarecrow pet.", inStock: 1 },
  { id: generateId("Mechbug"), name: "Mechbug", price: 17, category: "Budget", rarity: "Rare", description: "Mechanical bug pet.", inStock: 1 },
  { id: generateId("Vampire Bat"), name: "Vampire Bat", price: 17, category: "Budget", rarity: "Uncommon", description: "Dark vampire bat pet.", inStock: 1 },
  { id: generateId("Seahorsey"), name: "Seahorsey", price: 17, category: "Budget", rarity: "Common", description: "Cute seahorse pet.", inStock: 1 },
  { id: generateId("Skelly"), name: "Skelly", price: 17, category: "Budget", rarity: "Uncommon", description: "Skeleton-themed pet.", inStock: 1 },
  { id: generateId("Skeleton Key"), name: "Skeleton Key", price: 17, category: "Budget", rarity: "Rare", description: "Rare skeleton key item.", inStock: 1 },
  { id: generateId("Fairy"), name: "Fairy", price: 17, category: "Budget", rarity: "Rare", description: "Magical fairy pet.", inStock: 1 },
  { id: generateId("Traveller"), name: "Traveller", price: 17, category: "Budget", rarity: "Uncommon", description: "Adventure traveller pet.", inStock: 1 },
  { id: generateId("Snowflake Key"), name: "Snowflake Key", price: 17, category: "Budget", rarity: "Rare", description: "Icy snowflake key.", inStock: 1 },
  { id: generateId("Badger"), name: "Badger", price: 17, category: "Budget", rarity: "Common", description: "Cute badger pet.", inStock: 1 },
  { id: generateId("Box of Ultra Wrapping Paper"), name: "Box of Ultra Wrapping Paper", price: 17, category: "Budget", rarity: "Common", description: "Ultra quality wrapping paper.", inStock: 1 },
  { id: generateId("Box of Green Wrapping Paper"), name: "Box of Green Wrapping Paper", price: 17, category: "Budget", rarity: "Common", description: "Green wrapping paper box.", inStock: 1 },
  { id: generateId("Box of Red Wrapping Paper"), name: "Box of Red Wrapping Paper", price: 17, category: "Budget", rarity: "Common", description: "Red wrapping paper box.", inStock: 1 },
  { id: generateId("Fire Dog"), name: "Fire Dog", price: 17, category: "Budget", rarity: "Rare", description: "Fiery dog pet with flames.", inStock: 1 },
  { id: generateId("Fire Cat"), name: "Fire Cat", price: 17, category: "Budget", rarity: "Rare", description: "Blazing fire cat pet.", inStock: 1 },
  { id: generateId("Fire Bunny"), name: "Fire Bunny", price: 17, category: "Budget", rarity: "Rare", description: "Flaming bunny pet.", inStock: 1 },
  { id: generateId("Fire Pig"), name: "Fire Pig", price: 17, category: "Budget", rarity: "Rare", description: "Hot fire pig pet.", inStock: 1 },
  { id: generateId("Fire Fox"), name: "Fire Fox", price: 17, category: "Budget", rarity: "Rare", description: "Burning fire fox pet.", inStock: 1 },
  { id: generateId("Blue Scratch"), name: "Blue Scratch", price: 17, category: "Budget", rarity: "Common", description: "Blue scratch knife design.", inStock: 1 },
  { id: generateId("Red Scratch"), name: "Red Scratch", price: 17, category: "Budget", rarity: "Common", description: "Red scratch knife design.", inStock: 1 },
  { id: generateId("Green Fire"), name: "Green Fire", price: 17, category: "Budget", rarity: "Uncommon", description: "Green fire effect knife.", inStock: 1 },
  { id: generateId("Green Marble"), name: "Green Marble", price: 17, category: "Budget", rarity: "Common", description: "Elegant green marble knife.", inStock: 1 },
  { id: generateId("Cane Knife"), name: "Cane Knife", price: 17, category: "Budget", rarity: "Common", description: "Candy cane styled knife.", inStock: 1 },
  { id: generateId("Vampire"), name: "Vampire", price: 17, category: "Budget", rarity: "Uncommon", description: "Dark vampire knife.", inStock: 1 },
  { id: generateId("Elite"), name: "Elite", price: 17, category: "Budget", rarity: "Common", description: "Classic elite knife.", inStock: 1 },
  { id: generateId("Cavern Knife"), name: "Cavern Knife", price: 17, category: "Budget", rarity: "Uncommon", description: "Dark cavern knife.", inStock: 1 },
  { id: generateId("TNL"), name: "TNL", price: 17, category: "Budget", rarity: "Common", description: "TNL special knife.", inStock: 1 },
  { id: generateId("Patrick"), name: "Patrick", price: 17, category: "Budget", rarity: "Common", description: "Patrick themed knife.", inStock: 1 },
  { id: generateId("Elf Knife"), name: "Elf Knife", price: 17, category: "Budget", rarity: "Common", description: "Festive elf knife.", inStock: 1 },
  { id: generateId("Ornament Knife"), name: "Ornament Knife", price: 17, category: "Budget", rarity: "Common", description: "Christmas ornament knife.", inStock: 1 },
  { id: generateId("2015"), name: "2015", price: 17, category: "Budget", rarity: "Rare", description: "Classic 2015 knife.", inStock: 1 },
  { id: generateId("Snowflake"), name: "Snowflake", price: 17, category: "Budget", rarity: "Common", description: "Icy snowflake knife.", inStock: 1 },
  { id: generateId("Infected"), name: "Infected", price: 17, category: "Budget", rarity: "Uncommon", description: "Infected green knife.", inStock: 1 },
  { id: generateId("Web"), name: "Web", price: 17, category: "Budget", rarity: "Common", description: "Spider web knife.", inStock: 1 },
  { id: generateId("Santa's Magic"), name: "Santa's Magic", price: 17, category: "Budget", rarity: "Uncommon", description: "Magical Santa knife.", inStock: 1 },
  { id: generateId("Santa's Spirit"), name: "Santa's Spirit", price: 17, category: "Budget", rarity: "Uncommon", description: "Spirit of Santa knife.", inStock: 1 },
  { id: generateId("Ripper Knife"), name: "Ripper Knife", price: 17, category: "Budget", rarity: "Common", description: "Sharp ripper knife.", inStock: 1 },
  { id: generateId("Tree Knife"), name: "Tree Knife", price: 17, category: "Budget", rarity: "Common", description: "Nature tree knife.", inStock: 1 },
  { id: generateId("Santa Knife"), name: "Santa Knife", price: 17, category: "Budget", rarity: "Common", description: "Jolly Santa knife.", inStock: 1 },
  { id: generateId("Goo"), name: "Goo", price: 17, category: "Budget", rarity: "Uncommon", description: "Slimy goo knife.", inStock: 1 },
  { id: generateId("Eyeball"), name: "Eyeball", price: 17, category: "Budget", rarity: "Uncommon", description: "Spooky eyeball knife.", inStock: 1 },
  { id: generateId("Cane Gun"), name: "Cane Gun", price: 17, category: "Budget", rarity: "Common", description: "Candy cane gun.", inStock: 1 },

  // STANDARD ITEMS - 26 EGP
  { id: generateId("Shadow"), name: "Shadow", price: 26, category: "Standard", rarity: "Rare", description: "Dark shadow-themed knife with ethereal effects.", inStock: 1 },
  { id: generateId("Phoenix"), name: "Phoenix", price: 26, category: "Standard", rarity: "Legendary", description: "Fiery phoenix knife rises from ashes.", inStock: 1 },
  { id: generateId("Nobledragon"), name: "Nobledragon", price: 26, category: "Standard", rarity: "Legendary", description: "Majestic noble dragon pet.", inStock: 1 },
  { id: generateId("Overseer Eye"), name: "Overseer Eye", price: 26, category: "Standard", rarity: "Rare", description: "All-seeing overseer eye.", inStock: 1 },
  { id: generateId("Jetstream"), name: "Jetstream", price: 26, category: "Standard", rarity: "Rare", description: "Fast jetstream knife.", inStock: 1 },
  { id: generateId("Icey"), name: "Icey", price: 26, category: "Standard", rarity: "Rare", description: "Frozen icy knife.", inStock: 1 },
  { id: generateId("Steambird"), name: "Steambird", price: 26, category: "Standard", rarity: "Rare", description: "Steampunk bird pet.", inStock: 1 },
  { id: generateId("Red Seer"), name: "Red Seer", price: 26, category: "Standard", rarity: "Rare", description: "Crimson red seer knife.", inStock: 1 },
  { id: generateId("Blue Seer"), name: "Blue Seer", price: 26, category: "Standard", rarity: "Rare", description: "Azure blue seer knife.", inStock: 1 },
  { id: generateId("Ornament2 Set"), name: "Ornament2 Set", price: 26, category: "Standard", rarity: "Rare", description: "Complete ornament set.", inStock: 1 },
  { id: generateId("Toxic Set"), name: "Toxic Set", price: 26, category: "Standard", rarity: "Rare", description: "Poisonous toxic set.", inStock: 1 },
  { id: generateId("Aurora Set"), name: "Aurora Set", price: 26, category: "Standard", rarity: "Legendary", description: "Beautiful aurora set.", inStock: 1 },
  { id: generateId("Frostbird"), name: "Frostbird", price: 26, category: "Standard", rarity: "Rare", description: "Frozen frost bird pet.", inStock: 1 },
  { id: generateId("Seer"), name: "Seer", price: 26, category: "Standard", rarity: "Rare", description: "Classic seer knife.", inStock: 1 },
  { id: generateId("Gemstone"), name: "Gemstone", price: 23, category: "Standard", rarity: "Rare", description: "Precious gemstone knife.", inStock: 1 },
  { id: generateId("Xmas"), name: "Xmas", price: 23, category: "Standard", rarity: "Rare", description: "Festive Christmas knife.", inStock: 1 },
  { id: generateId("Virtual"), name: "Virtual", price: 23, category: "Standard", rarity: "Legendary", description: "Digital virtual knife.", inStock: 1 },
  { id: generateId("Gingerblade"), name: "Gingerblade", price: 19, category: "Standard", rarity: "Rare", description: "Sweet gingerbread blade.", inStock: 1 },
  { id: generateId("Ice Flake"), name: "Ice Flake", price: 25, category: "Standard", rarity: "Rare", description: "Frozen ice flake knife.", inStock: 1 },

  // GODLY ITEMS - 18 EGP
  { id: generateId("Icewing"), name: "Icewing", price: 18, category: "Godly", rarity: "Godly", description: "Legendary Icewing with frozen aura.", inStock: 1 },
  { id: generateId("Fang"), name: "Fang", price: 18, category: "Godly", rarity: "Godly", description: "Deadly Fang knife with sharp edges.", inStock: 1 },
  { id: generateId("Heat"), name: "Heat", price: 18, category: "Godly", rarity: "Godly", description: "Blazing Heat knife burns bright.", inStock: 1 },
  { id: generateId("Tides"), name: "Tides", price: 18, category: "Godly", rarity: "Godly", description: "Ocean Tides knife flows eternally.", inStock: 1 },
  { id: generateId("Spider"), name: "Spider", price: 18, category: "Godly", rarity: "Godly", description: "Venomous Spider knife design.", inStock: 1 },
  { id: generateId("Eternal"), name: "Eternal", price: 18, category: "Godly", rarity: "Godly", description: "Timeless Eternal knife.", inStock: 1 },
  { id: generateId("Eternal II"), name: "Eternal II", price: 18, category: "Godly", rarity: "Godly", description: "Enhanced Eternal II knife.", inStock: 1 },
  { id: generateId("Eternal III"), name: "Eternal III", price: 18, category: "Godly", rarity: "Godly", description: "Superior Eternal III knife.", inStock: 1 },
  { id: generateId("Eternal IV"), name: "Eternal IV", price: 18, category: "Godly", rarity: "Godly", description: "Ultimate Eternal IV knife.", inStock: 1 },
  { id: generateId("Eternalcane"), name: "Eternalcane", price: 18, category: "Godly", rarity: "Godly", description: "Festive Eternalcane knife.", inStock: 1 },
  { id: generateId("Hallow's Edge"), name: "Hallow's Edge", price: 18, category: "Godly", rarity: "Godly", description: "Spooky Hallow's Edge knife.", inStock: 1 },
  { id: generateId("Frostbite"), name: "Frostbite", price: 15, category: "Godly", rarity: "Godly", description: "Chilling Frostbite knife.", inStock: 1 },
  { id: generateId("Frostsaber"), name: "Frostsaber", price: 15, category: "Godly", rarity: "Godly", description: "Frozen Frostsaber weapon.", inStock: 1 },
  { id: generateId("Flames"), name: "Flames", price: 14, category: "Godly", rarity: "Godly", description: "Burning Flames knife.", inStock: 1 },
  { id: generateId("Boneblade"), name: "Boneblade", price: 14, category: "Godly", rarity: "Godly", description: "Skeletal Boneblade knife.", inStock: 1 },
  { id: generateId("Chill"), name: "Chill", price: 14, category: "Godly", rarity: "Godly", description: "Cool Chill knife.", inStock: 1 },
  { id: generateId("Handsaw"), name: "Handsaw", price: 14, category: "Godly", rarity: "Godly", description: "Sharp Handsaw knife.", inStock: 1 },
  { id: generateId("Chroma Fire Bat"), name: "Chroma Fire Bat", price: 14, category: "Godly", rarity: "Chroma", description: "Chromatic fire bat pet.", inStock: 1 },
  { id: generateId("Chroma Fire Dog"), name: "Chroma Fire Dog", price: 14, category: "Godly", rarity: "Chroma", description: "Chromatic fire dog pet.", inStock: 1 },
  { id: generateId("Chroma Fire Cat"), name: "Chroma Fire Cat", price: 14, category: "Godly", rarity: "Chroma", description: "Chromatic fire cat pet.", inStock: 1 },
  { id: generateId("Chroma Fire Pig"), name: "Chroma Fire Pig", price: 14, category: "Godly", rarity: "Chroma", description: "Chromatic fire pig pet.", inStock: 1 },
  { id: generateId("Chroma Fire Fox"), name: "Chroma Fire Fox", price: 14, category: "Godly", rarity: "Chroma", description: "Chromatic fire fox pet.", inStock: 1 },
  { id: generateId("Chroma Fire Bear"), name: "Chroma Fire Bear", price: 14, category: "Godly", rarity: "Chroma", description: "Chromatic fire bear pet.", inStock: 1 },
  { id: generateId("Chroma Fire Bunny"), name: "Chroma Fire Bunny", price: 14, category: "Godly", rarity: "Chroma", description: "Chromatic fire bunny pet.", inStock: 1 },
  { id: generateId("Ice Shard"), name: "Ice Shard", price: 13, category: "Godly", rarity: "Godly", description: "Frozen Ice Shard knife.", inStock: 1 },
  { id: generateId("Winters Edge"), name: "Winters Edge", price: 12, category: "Godly", rarity: "Godly", description: "Cold Winter's Edge knife.", inStock: 1 },

  // ANCIENT ITEMS - 27-44 EGP
  { id: generateId("Vampire's Edge"), name: "Vampire's Edge", price: 44, category: "Ancient", rarity: "Ancient", description: "Ancient vampire-themed edge blade.", inStock: 1 },
  { id: generateId("Green Luger"), name: "Green Luger", price: 44, category: "Ancient", rarity: "Ancient", description: "Classic green Luger gun.", inStock: 1 },
  { id: generateId("Battleaxe"), name: "Battleaxe", price: 44, category: "Ancient", rarity: "Ancient", description: "Mighty battleaxe weapon.", inStock: 1 },
  { id: generateId("Nightblade"), name: "Nightblade", price: 44, category: "Ancient", rarity: "Ancient", description: "Dark nightblade knife.", inStock: 1 },
  { id: generateId("Bioblade"), name: "Bioblade", price: 44, category: "Ancient", rarity: "Ancient", description: "Biological bioblade weapon.", inStock: 1 },
  { id: generateId("Saw"), name: "Saw", price: 44, category: "Ancient", rarity: "Ancient", description: "Sharp saw blade.", inStock: 1 },
  { id: generateId("Pumpking"), name: "Pumpking", price: 44, category: "Ancient", rarity: "Ancient", description: "Spooky pumpkin king.", inStock: 1 },
  { id: generateId("Blood"), name: "Blood", price: 44, category: "Ancient", rarity: "Ancient", description: "Crimson blood knife.", inStock: 1 },
  { id: generateId("Heart Pet"), name: "Heart Pet", price: 44, category: "Ancient", rarity: "Ancient", description: "Loving heart pet.", inStock: 1 },
  { id: generateId("Cookiecane"), name: "Cookiecane", price: 44, category: "Ancient", rarity: "Ancient", description: "Sweet cookie cane.", inStock: 1 },
  { id: generateId("Pixel"), name: "Pixel", price: 36, category: "Ancient", rarity: "Ancient", description: "Retro pixel knife.", inStock: 1 },
  { id: generateId("Ginger Luger"), name: "Ginger Luger", price: 36, category: "Ancient", rarity: "Ancient", description: "Gingerbread Luger gun.", inStock: 1 },
  { id: generateId("Hallowgun"), name: "Hallowgun", price: 36, category: "Ancient", rarity: "Ancient", description: "Spooky Halloween gun.", inStock: 1 },
  { id: generateId("Ghost"), name: "Ghost", price: 35, category: "Ancient", rarity: "Ancient", description: "Ethereal ghost knife.", inStock: 1 },
  { id: generateId("Deathspeaker"), name: "Deathspeaker", price: 35, category: "Ancient", rarity: "Ancient", description: "Deadly deathspeaker weapon.", inStock: 1 },
  { id: generateId("Electro"), name: "Electro", price: 35, category: "Ancient", rarity: "Ancient", description: "Electric electro knife.", inStock: 1 },
  { id: generateId("Sammy"), name: "Sammy", price: 35, category: "Ancient", rarity: "Ancient", description: "Classic Sammy pet.", inStock: 1 },
  { id: generateId("Prismatic"), name: "Prismatic", price: 35, category: "Ancient", rarity: "Ancient", description: "Rainbow prismatic knife.", inStock: 1 },
  { id: generateId("Prince"), name: "Prince", price: 35, category: "Ancient", rarity: "Ancient", description: "Royal prince knife.", inStock: 1 },
  { id: generateId("Peppermint"), name: "Peppermint", price: 35, category: "Ancient", rarity: "Ancient", description: "Sweet peppermint knife.", inStock: 1 },
  { id: generateId("Wrapping Paper Bundle"), name: "Wrapping Paper Bundle", price: 35, category: "Ancient", rarity: "Ancient", description: "Festive wrapping paper set.", inStock: 1 },
  { id: generateId("Logchopper"), name: "Logchopper", price: 32, category: "Ancient", rarity: "Ancient", description: "Powerful log chopper axe.", inStock: 1 },
  { id: generateId("Lugercane"), name: "Lugercane", price: 32, category: "Ancient", rarity: "Ancient", description: "Candy cane Luger gun.", inStock: 1 },
  { id: generateId("Old Glory"), name: "Old Glory", price: 32, category: "Ancient", rarity: "Ancient", description: "Patriotic old glory knife.", inStock: 1 },
  { id: generateId("BattleAxe II"), name: "BattleAxe II", price: 32, category: "Ancient", rarity: "Ancient", description: "Enhanced battleaxe II.", inStock: 1 },
  { id: generateId("Nebula"), name: "Nebula", price: 27, category: "Ancient", rarity: "Ancient", description: "Cosmic nebula knife.", inStock: 1 },
  { id: generateId("Slasher"), name: "Slasher", price: 27, category: "Ancient", rarity: "Ancient", description: "Sharp slasher knife.", inStock: 1 },
  { id: generateId("Minty"), name: "Minty", price: 27, category: "Ancient", rarity: "Ancient", description: "Fresh minty knife.", inStock: 1 },
  { id: generateId("JingleGun"), name: "JingleGun", price: 27, category: "Ancient", rarity: "Ancient", description: "Festive jingle gun.", inStock: 1 },
  { id: generateId("Clockwork"), name: "Clockwork", price: 27, category: "Ancient", rarity: "Ancient", description: "Mechanical clockwork knife.", inStock: 1 },

  // BUNDLES - 269-675 EGP
  { id: generateId("Chroma Knife Set"), name: "Chroma Knife Set", price: 269, category: "Bundles", rarity: "Chroma", description: "Complete set of chromatic knives with rainbow effects.", inStock: 1 },
  { id: generateId("Bat Bundle"), name: "Bat", price: 269, category: "Bundles", rarity: "Legendary", description: "Exclusive bat-themed bundle.", inStock: 1 },
  { id: generateId("Sparkle Set"), name: "Sparkle Set", price: 269, category: "Bundles", rarity: "Legendary", description: "Sparkling set of items.", inStock: 1 },
  { id: generateId("Brontosaurus"), name: "Brontosaurus", price: 269, category: "Bundles", rarity: "Legendary", description: "Prehistoric brontosaurus bundle.", inStock: 1 },
  { id: generateId("Borealis"), name: "Borealis", price: 311, category: "Bundles", rarity: "Legendary", description: "Northern lights borealis set.", inStock: 1 },
  { id: generateId("Mega Chroma Knives Bundle"), name: "Mega Chroma Knives Bundle", price: 359, category: "Bundles", rarity: "Chroma", description: "Ultimate mega chroma knife collection.", inStock: 1 },
  { id: generateId("Chroma Bringer Set"), name: "Chroma Bringer Set", price: 359, category: "Bundles", rarity: "Chroma", description: "Chromatic bringer weapon set.", inStock: 1 },
  { id: generateId("Ice Bundle"), name: "Ice Bundle", price: 378, category: "Bundles", rarity: "Legendary", description: "Frozen ice themed bundle.", inStock: 1 },
  { id: generateId("Icepiercer"), name: "Icepiercer", price: 383, category: "Bundles", rarity: "Legendary", description: "Sharp icepiercer weapon bundle.", inStock: 1 },
  { id: generateId("Scythe Set"), name: "Scythe Set", price: 449, category: "Bundles", rarity: "Ancient", description: "Deadly scythe weapon set.", inStock: 1 },
  { id: generateId("Full Swirly Bundle"), name: "Full Swirly Bundle", price: 449, category: "Bundles", rarity: "Legendary", description: "Complete swirly pattern bundle.", inStock: 1 },
  { id: generateId("Halloween Bundle"), name: "Halloween Bundle", price: 449, category: "Bundles", rarity: "Legendary", description: "Spooky Halloween collection.", inStock: 1 },
  { id: generateId("Candy Set"), name: "Candy Set", price: 449, category: "Bundles", rarity: "Legendary", description: "Sweet candy themed set.", inStock: 1 },
  { id: generateId("Ancient Mega Bundle"), name: "Ancient Mega Bundle", price: 494, category: "Bundles", rarity: "Ancient", description: "Massive ancient item collection.", inStock: 1 },
  { id: generateId("Harvester"), name: "Harvester", price: 495, category: "Bundles", rarity: "Ancient", description: "Powerful harvester weapon.", inStock: 1 },
  { id: generateId("Full Elderwood Bundle"), name: "Full Elderwood Bundle", price: 503, category: "Bundles", rarity: "Ancient", description: "Complete elderwood collection.", inStock: 1 },
  { id: generateId("Borealis Set"), name: "Borealis Set", price: 626, category: "Bundles", rarity: "Legendary", description: "Complete borealis themed set.", inStock: 1 },
  { id: generateId("Super Luger Bundle"), name: "Super Luger Bundle", price: 629, category: "Bundles", rarity: "Ancient", description: "Ultimate Luger gun collection.", inStock: 1 },
  { id: generateId("Chroma Gun Set"), name: "Chroma Gun Set", price: 675, category: "Bundles", rarity: "Chroma", description: "Complete chromatic gun collection.", inStock: 1 },
  { id: generateId("Full Ice Bundle"), name: "Full Ice Bundle", price: 675, category: "Bundles", rarity: "Legendary", description: "Ultimate frozen ice bundle.", inStock: 1 },

  // ROYAL/PREMIUM ITEMS - 755-5129 EGP
  { id: generateId("Bat Bundle Royal"), name: "Bat Bundle", price: 755, category: "Royal", rarity: "Ancient", description: "Premium bat themed bundle.", inStock: 1 },
  { id: generateId("Corrupt"), name: "Corrupt", price: 1031, category: "Royal", rarity: "Ancient", description: "Corrupted dark weapon set.", inStock: 1 },
  { id: generateId("Christmas Collection"), name: "Christmas Collection", price: 1169, category: "Royal", rarity: "Legendary", description: "Complete Christmas themed collection.", inStock: 1 },
  { id: generateId("Mega Chroma Bundle"), name: "Mega Chroma Bundle", price: 1259, category: "Royal", rarity: "Chroma", description: "Ultimate mega chroma collection.", inStock: 1 },
  { id: generateId("Harvester Bundle"), name: "Harvester Bundle", price: 1373, category: "Royal", rarity: "Ancient", description: "Complete harvester bundle.", inStock: 1 },
  { id: generateId("Golden Bundle"), name: "Golden Bundle", price: 1709, category: "Royal", rarity: "Legendary", description: "Prestigious golden item bundle.", inStock: 1 },
  { id: generateId("Best Bundle"), name: "Best Bundle", price: 2699, category: "Royal", rarity: "Ancient", description: "The best value bundle available.", inStock: 1 },
  { id: generateId("Turkey Knife"), name: "Turkey Knife", price: 2879, category: "Royal", rarity: "Ancient", description: "Rare turkey themed knife.", inStock: 1 },
  { id: generateId("Mega OP Bundle"), name: "Mega OP Bundle", price: 2969, category: "Royal", rarity: "Ancient", description: "Overpowered mega bundle.", inStock: 1 },
  { id: generateId("Traveler's Gun"), name: "Traveler's Gun", price: 5129, category: "Royal", rarity: "Ancient", description: "Legendary traveler's gun - the rarest item.", inStock: 1 },
];

// Get products by category
export function getProductsByCategory(category: Category): Product[] {
  return allProducts.filter(p => p.category === category);
}

// Get featured products (high value items)
export function getFeaturedProducts(): Product[] {
  return allProducts
    .filter(p => p.rarity === "Godly" || p.rarity === "Ancient" || p.rarity === "Chroma")
    .slice(0, 8);
}

// Get top selling items (mix of categories)
export function getTopSellingProducts(): Product[] {
  const topItems = [
    "Icewing", "Fang", "Heat", "Chroma Knife Set", "Harvester", 
    "Corrupt", "Phoenix", "Eternal", "Flames", "Nebula", "Pixel", "Ghost"
  ];
  return allProducts.filter(p => topItems.includes(p.name));
}

// Search products
export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return allProducts.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description?.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery) ||
    p.rarity.toLowerCase().includes(lowerQuery)
  );
}

// Get product by ID
export function getProductById(id: string): Product | undefined {
  return allProducts.find(p => p.id === id);
}

// Category info for display
export const categoryInfo: Record<Category, { description: string; itemCount: number }> = {
  Budget: { description: "Affordable items perfect for starting your collection", itemCount: allProducts.filter(p => p.category === "Budget").length },
  Standard: { description: "Quality items with great value", itemCount: allProducts.filter(p => p.category === "Standard").length },
  Godly: { description: "Legendary godly items with powerful effects", itemCount: allProducts.filter(p => p.category === "Godly").length },
  Ancient: { description: "Rare ancient weapons from the past", itemCount: allProducts.filter(p => p.category === "Ancient").length },
  Bundles: { description: "Value bundles with multiple items", itemCount: allProducts.filter(p => p.category === "Bundles").length },
  Royal: { description: "The most exclusive premium items", itemCount: allProducts.filter(p => p.category === "Royal").length },
};

// Rarity colors for badges
export const rarityColors: Record<string, string> = {
  Common: "bg-slate-600 text-slate-100",
  Uncommon: "bg-emerald-600 text-emerald-100",
  Rare: "bg-blue-600 text-blue-100",
  Legendary: "bg-purple-600 text-purple-100",
  Godly: "bg-amber-500 text-amber-950",
  Ancient: "bg-red-600 text-red-100",
  Chroma: "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white",
};
