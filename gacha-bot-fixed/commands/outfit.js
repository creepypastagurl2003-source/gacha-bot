const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getMascot } = require('../utils/storage');
const { getMoodColor } = require('../utils/responses');
const { MASCOT_TYPES } = require('../utils/mascotTypes');

const OUTFIT_DATA = {
    Angel: {
        tops: ['Sheer white puff-sleeve blouse with gold embroidery', 'Celestial lace cropped top with ribbon ties', 'Soft ivory corset with feather trim and gold buttons'],
        bottoms: ['Flowy white midi skirt with starlight hem', 'Layered tulle skirt in ivory and pale gold', 'Billowing white palazzo pants with gold ribbon belt'],
        dresses: ['Draped off-shoulder angelic gown in ivory', 'Tiered celestial dress with glowing hem', 'Soft A-line dress with feathered sleeves'],
        shoes: ['White mary janes with gold buckle straps', 'Platform sandals with ribbon lace-up ankles', 'Ivory pointed flats with star charms'],
        layers: ['Sheer gold-trimmed capelet', 'Translucent white bishop-sleeve cardigan', 'Flowing white duster coat with halo clasp'],
        accessories: ['Glowing golden halo', 'White feather hair clips', 'Delicate star-chain choker'],
        styleTheme: 'Celestial Ethereal — soft whites, divine golds, and flowing silhouettes',
    },
    Demon: {
        tops: ['Black cropped corset with red lace-up detail', 'Dark red strapless bustier with chain accents', 'Oversized shredded black tee tied at the waist'],
        bottoms: ['Asymmetric black mini skirt with chain belt', 'High-waisted crimson leather pants with buckle straps', 'Shredded black wide-leg trousers'],
        dresses: ['Floor-length black gown with deep red corset bodice', 'Off-shoulder dark red slit dress with chain trim', 'Gothic black lace midi dress'],
        shoes: ['Platform black boots with red sole', 'Heeled ankle boots with spike studs', 'Combat boots with chain strap'],
        layers: ['Red-lined black cape with dragon clasp', 'Cropped black moto jacket with flames on the back', 'Dark trench coat with red inner lining'],
        accessories: ['Small curved horns', 'Spiked choker with red gem', 'Chain wrist cuffs'],
        styleTheme: 'Dark Infernal — deep blacks, burning reds, and sharp silhouettes',
    },
    Fairy: {
        tops: ['Pastel floral crop top with petal sleeves', 'Sheer lavender blouse with ribbon bow front', 'Mint green off-shoulder ruffled top'],
        bottoms: ['Tiered pastel petal skirt with green trim', 'Short lilac tulle skirt with flower appliqués', 'Patterned pastel wide-leg pants'],
        dresses: ['Fluttery fairy-wing dress in soft pink and green', 'Layered pastel ombre dress with leaf trim', 'Sheer floral sundress with ribbon waist'],
        shoes: ['Pastel green pointed flats with flower detail', 'T-strap sandals with tiny flower charms', 'Ivory ballet flats with ribbon ties'],
        layers: ['Translucent pastel wing-cape', 'Floral embroidered mesh cardigan', 'Delicate sheer kimono with petal print'],
        accessories: ['Flower crown', 'Tiny butterfly wing hair pins', 'Dewdrop earrings'],
        styleTheme: 'Whimsical Garden — soft pastels, floral prints, and nature-inspired layers',
    },
    Witch: {
        tops: ['Deep purple lace-trim cropped blouse', 'Emerald velvet corset top with silver buckles', 'Black long-sleeve wrap top with crescent moon clasp'],
        bottoms: ['Long flowy dark green circle skirt with star embroidery', 'Black velvet midi skirt with purple hem', 'Plaid dark academia trousers in forest green'],
        dresses: ['Velvet witch dress in deep purple with wide sleeves', 'Black high-low dress with silver moon print', 'Forest green wrap dress with moon and star detail'],
        shoes: ['Black pointed-toe boots', 'Dark purple heeled oxfords', 'Silver-buckle ankle boots'],
        layers: ['Long black hooded cape', 'Emerald velvet longline coat', 'Dark academia blazer with moon pin'],
        accessories: ['Wide-brim pointed witch hat', 'Crystal ball pendant necklace', 'Silver crescent moon earrings'],
        styleTheme: 'Moonlit Coven — deep greens, rich purples, and mystical silver accents',
    },
    Mage: {
        tops: ['Deep blue velvet structured blouse with gold cuffs', 'Royal purple long-sleeve turtleneck with runic trim', 'Silver-lined navy cropped jacket'],
        bottoms: ['Billowing dark blue wizard trousers with gold trim', 'Navy pleated skirt with constellation embroidery', 'Deep purple wide-leg spell-caster pants'],
        dresses: ['Long royal blue robe-dress with silver star pattern', 'Deep purple mage dress with gold lapel detail', 'Structured navy dress with arcane embroidery'],
        shoes: ['Dark blue pointed boots with silver rune clasps', 'Royal purple heeled Oxford shoes', 'Navy platform loafers with gold buttons'],
        layers: ['Navy star-lined wizard cloak', 'Royal blue structured longline coat', 'Deep purple academic robe'],
        accessories: ['Floating arcane crystal staff prop', 'Rune-carved headband', 'Gold celestial choker'],
        styleTheme: 'Arcane Scholar — deep navies, regal purples, and gold runic accents',
    },
    Spirit: {
        tops: ['Translucent pale blue off-shoulder blouse', 'Wispy white asymmetric drape top', 'Sheer ice blue layered crop top'],
        bottoms: ['Floaty ombre blue-to-white skirt', 'Translucent layered ghost skirt', 'Pale mist wide-leg pants'],
        dresses: ['Sheer wispy ghost dress in icy blue', 'Translucent layered dress that moves like fog', 'Pale blue drape dress with luminescent hem'],
        shoes: ['Pale blue flat mules with ribbon', 'Translucent jelly sandals in ice blue', 'Soft white slip-ons'],
        layers: ['Wispy translucent blue duster', 'Sheer floating wrap in white and blue', 'Ghostly pale layered cape'],
        accessories: ['Floating orb hairpin', 'Ethereal blue veil headpiece', 'Pale crystal drop earrings'],
        styleTheme: 'Ethereal Mist — icy blues, translucent whites, and floating silhouettes',
    },
    Dragon: {
        tops: ['Scale-print cropped leather top in deep emerald', 'Armored chest piece with gold dragon detailing', 'Crimson structured crop top with wing-collar'],
        bottoms: ['Scale-textured fitted pants in forest green', 'Dragon-tail skirt with layered asymmetric hem', 'Armored greaves with flame hem'],
        dresses: ['Dragon-inspired structured gown with tail train', 'Scale-print bodycon dress in deep red-green', 'Armored bodice dress with draped back'],
        shoes: ['Dragon-claw pointed boots in emerald leather', 'Armored heel boots with gold talons', 'Scale-texture platform boots'],
        layers: ['Dragon-wing shoulder cape', 'Emerald scale-pattern longline coat', 'Crimson armored half-cape with gold clasp'],
        accessories: ['Dragon scale headband', 'Fang pendant necklace', 'Gold talon cuff bracelet'],
        styleTheme: 'Ancient Dragon — deep emeralds, burnished golds, and armored elegance',
    },
    Vampire: {
        tops: ['Black lace Victorian blouse with pearl buttons', 'Deep crimson velvet corset top with ruffled collar', 'Black off-shoulder top with blood-red satin bow'],
        bottoms: ['Floor-length black velvet skirt with red satin lining', 'Black high-waisted cigarette trousers with red trim', 'Crimson pleated midi skirt'],
        dresses: ['Victorian black lace gown with red underskirt', 'Off-shoulder black velvet maxi dress', 'Crimson and black ballgown with lace overlay'],
        shoes: ['Black heeled pointed boots', 'Victorian button-up ankle boots in black', 'Red velvet heeled flats with gold buckle'],
        layers: ['Long black cape with red satin lining and gold clasp', 'Velvet Victorian coat in deep black', 'Dramatic black bat-wing sleeve coat'],
        accessories: ['Elegant bat wing choker', 'Blood-red rose hair clip', 'Gold vintage brooch'],
        styleTheme: 'Gothic Aristocrat — Victorian blacks, rich crimsons, and dramatic layering',
    },
    Pastel: {
        tops: ['Baby pink ruffled off-shoulder crop top', 'Lavender puff-sleeve blouse with bow collar', 'Mint green cloud-print cropped tee'],
        bottoms: ['Fluffy pink tutu skirt', 'Lavender bubble mini skirt', 'Pastel yellow high-waisted A-line skirt'],
        dresses: ['Dreamy pastel ombre cloud dress', 'Baby pink tiered ruffle dress', 'Soft lavender babydoll dress with bow waist'],
        shoes: ['Pink T-strap mary janes with heart buckle', 'Lavender platform sneakers with star charm', 'Cloud-white chunky sandals'],
        layers: ['Fluffy pink cardigan with cloud buttons', 'Lavender bow-front cropped jacket', 'Sheer pastel rainbow duster'],
        accessories: ['Pastel rainbow bow headband', 'Star-shaped hair clips in assorted pastels', 'Heart locket necklace'],
        styleTheme: 'Soft Candy Dream — baby pinks, dreamy lavenders, and cloud whites',
    },
    Goth: {
        tops: ['Black velvet bustier with silver buckle detail', 'Shredded black long-sleeve with corset ties', 'Dark mesh top over a black bandeau'],
        bottoms: ['Black pleated mini skirt with safety pin trim', 'Ripped black skinny pants with chain belt', 'Long black asymmetric skirt with purple hem'],
        dresses: ['Black lace column dress with mesh overlay', 'Gothic fit-and-flare dress with bat trim', 'All-black wrap dress with silver chain accessories'],
        shoes: ['Black platform boots with silver buckles', 'Chunky black creepers with spider web detail', 'Black mary janes with bat charms'],
        layers: ['Black fishnet overshirt', 'Velvet dark purple longline coat', 'Cropped black moto jacket with studs'],
        accessories: ['Silver thorn crown headband', 'Layered silver chain necklaces', 'Bat wing ear cuffs'],
        styleTheme: 'Dark Velvet — rich blacks, silver edge, and structured gothic silhouettes',
    },
    'Dark Academia': {
        tops: ['Cream Oxford button-up with rolled sleeves', 'Forest green turtleneck sweater', 'Brown plaid cropped blazer over a white shirt'],
        bottoms: ['Dark brown high-waisted pleated trousers', 'Forest green plaid midi skirt', 'Black and brown plaid wide-leg pants'],
        dresses: ['Dark brown pinafore dress over cream blouse', 'Forest green library dress with button front', 'Dark plaid belted shirt dress'],
        shoes: ['Brown leather Oxford shoes', 'Dark Chelsea boots with gold buckle', 'Brown loafers with gold bit detail'],
        layers: ['Camel longline wool coat', 'Dark brown structured blazer', 'Forest green double-breasted coat'],
        accessories: ['Round tortoiseshell reading glasses', 'Gold pocket watch on chain', 'Leather book strap bag'],
        styleTheme: 'Scholarly Autumn — warm browns, forest greens, and cream academic tones',
    },
    Softcore: {
        tops: ['Cream knit crop sweater with pearl buttons', 'Pale peach puff-sleeve blouse', 'Soft white oversized turtleneck'],
        bottoms: ['Warm cream corduroy skirt', 'Pale peach high-waisted trousers', 'Soft knit cream midi skirt'],
        dresses: ['Cozy cream sweater dress with knit texture', 'Soft peach sundress with ruffle hem', 'Warm ivory wrap dress'],
        shoes: ['Cream platform loafers', 'Soft peach ballet flats with bow', 'White chunky sneakers'],
        layers: ['Oversized cream blanket cardigan', 'Pale peach quilted jacket', 'Soft white fluffy zip-up hoodie'],
        accessories: ['Cream ribbon hair bow', 'Tiny gold daisy earrings', 'Woven pearl headband'],
        styleTheme: 'Cozy Sunday — warm creams, soft peaches, and comforting textures',
    },
    Scene: {
        tops: ['Neon green band tee knotted at the waist', 'Hot pink and black striped cropped top', 'Electric blue graphic tee with skulls and stars'],
        bottoms: ['Black and neon pink plaid mini skirt', 'Ripped black jeans with colorful patches', 'Electric blue cargo pants'],
        dresses: ['Neon zebra print mini dress', 'Black tutu dress with multicolor tulle layers', 'Scene-core asymmetric print dress'],
        shoes: ['Black platform sneakers with neon soles', 'Neon green and black chunky boots', 'Hot pink high-top Converse'],
        layers: ['Hot pink faux fur cropped jacket', 'Black zip hoodie with neon strip detail', 'Ripped denim vest with pins everywhere'],
        accessories: ['Multicolor star hair clips (many)', 'Thick black eyeliner bands worn as accessories', 'Neon plastic bangle stack'],
        styleTheme: 'Neon Scene Queen — electric colors, chaotic prints, and maximum layering',
    },
    Emo: {
        tops: ['Faded black band tee', 'Black long-sleeve with red stripe detail', 'Grey thermal top under an open black overshirt'],
        bottoms: ['Black skinnies with red stitching', 'Dark grey plaid pants', 'Black ripped jeans'],
        dresses: ['Black lace-trim tea dress', 'Emo plaid babydoll dress with belt', 'All-black asymmetric dress'],
        shoes: ['Black Converse high-tops', 'Worn black combat boots', 'Black platform shoes with red laces'],
        layers: ['Black zip-up hoodie', 'Faded black denim jacket with patches', 'Black asymmetric open cardigan'],
        accessories: ['Black wristbands stacked', 'Small star or skull earrings', 'Black ribbon choker'],
        styleTheme: 'Black Parade — deep blacks, dark greys, and subtle red accents',
    },
    Y2K: {
        tops: ['Silver holographic crop tube top', 'Hot pink velour off-shoulder top', 'Rhinestone-trimmed butterfly print crop top'],
        bottoms: ['Low-rise silver metallic mini skirt', 'Butterfly print cargo pants in pink', 'Velour hot pink flared pants'],
        dresses: ['Silver metallic slip dress with rhinestone trim', 'Pink velour mini dress', 'Y2K butterfly print asymmetric dress'],
        shoes: ['Silver platform sandals', 'Hot pink chunky heeled mules', 'White sneakers with iridescent sole'],
        layers: ['Silver puffer vest', 'Pink velour zip jacket', 'Iridescent fishnet overshirt'],
        accessories: ['Tinted butterfly sunglasses', 'Rhinestone belt', 'Layered chain necklaces with charms'],
        styleTheme: 'Chrome Butterfly — metallics, pinks, and early 2000s maximalism',
    },
    Dreamcore: {
        tops: ['Soft periwinkle off-shoulder blouse with cloud print', 'Lavender dreamscape graphic top', 'Washed purple surreal art tee'],
        bottoms: ['Periwinkle ombre midi skirt', 'Soft lilac wide-leg trousers with cloud embroidery', 'Dreamy lavender tulle skirt'],
        dresses: ['Periwinkle surreal print sundress', 'Lavender ombre dreamcore dress', 'Soft purple floaty maxi dress'],
        shoes: ['Periwinkle mary janes', 'Lavender chunky platform shoes', 'Soft purple slip-ons'],
        layers: ['Washed denim jacket with dream art patches', 'Lavender sheer duster with cloud print', 'Soft periwinkle zip hoodie'],
        accessories: ['Dreamcatcher hair piece', 'Lavender star halo', 'Cloud charm necklace'],
        styleTheme: 'Liminal Lavender — periwinkles, dreamy purples, and surreal prints',
    },
    Glitch: {
        tops: ['Black crop top with red and blue glitch-stripe print', 'White graphic tee with corrupted pixel art', 'Neon green mesh top with error-pattern overlay'],
        bottoms: ['Black vinyl mini skirt with glitch-print panel', 'Electric blue and black glitch-stripe pants', 'Distorted print digital shorts'],
        dresses: ['Error-print bodycon dress with glitch seams', 'Black dress with holographic glitch-stripe detail', 'Fragmented digital print mini dress'],
        shoes: ['Black platform boots with blue LED strip', 'Neon-soled black sneakers with glitch logo', 'Error-print chunky platform shoes'],
        layers: ['Oversized black hoodie with pixelated error print', 'Neon green transparent jacket', 'Black data-stripe bomber jacket'],
        accessories: ['Broken pixel headset prop', 'Error code kaomoji badge cluster', 'Blue and red glitch-pattern ear cuffs'],
        styleTheme: 'Corrupted Data — black voids, electric blues, and broken neon accents',
    },
    Cyber: {
        tops: ['Black techwear crop top with LED trim', 'Neon blue structured bodysuit', 'Dark grey tactical crop top with utility straps'],
        bottoms: ['Black cargo pants with neon piping', 'Structured cyber mini skirt with utility panels', 'Dark techwear wide-leg pants'],
        dresses: ['Sleek neon-lined black cyber dress', 'Dark bodycon dress with LED strip detail', 'Structured black mini dress with blue paneling'],
        shoes: ['Black platform combat boots with neon blue trim', 'Chunky cyber sneakers with LED strip', 'Dark tactical boots with utility strap'],
        layers: ['Black techwear longline jacket with blue underlighting', 'Neon blue transparent rain jacket', 'Dark structured trench with tech panels'],
        accessories: ['Sleek visor', 'Neon ear comm', 'Geometric neon collar'],
        styleTheme: 'Neo Tokyo Night — techwear blacks, electric blues, and tactical layering',
    },
    AI: {
        tops: ['White and silver geometric pattern cropped top', 'Pale blue circuit-print structured blouse', 'Holographic white crop top with data-line print'],
        bottoms: ['White structured mini skirt with silver circuit embroidery', 'Pale blue pleated tech skirt', 'Silver and white geometric print trousers'],
        dresses: ['White holographic bodycon dress with circuit print', 'Pale blue geometric shift dress', 'Silver-white structured mini dress'],
        shoes: ['White patent platform shoes', 'Pale blue pointed flats', 'Silver metallic mules'],
        layers: ['White structured blazer with silver trim', 'Pale blue pleated shrug', 'Clear vinyl white jacket'],
        accessories: ['Circuit board halo headpiece', 'Silver neural ear clip', 'Holographic data orb pendant'],
        styleTheme: 'Digital Mind — clean whites, icy blues, and silver geometric precision',
    },
    Hologram: {
        tops: ['Iridescent holographic crop top', 'Sheer blue-to-purple gradient blouse', 'Translucent holographic structured top'],
        bottoms: ['Holographic mini skirt in shifting blue-green', 'Iridescent wide-leg trousers', 'Translucent layered hologram skirt'],
        dresses: ['Shifting holographic mini dress', 'Translucent iridescent slip dress', 'Gradient blue-to-pink hologram dress'],
        shoes: ['Iridescent jelly platform sandals', 'Holographic clear mules', 'Translucent sneakers with shimmer'],
        layers: ['Iridescent vinyl trench coat', 'Holographic sheer duster', 'Translucent shimmer raincoat'],
        accessories: ['Holographic projection crown', 'Iridescent geometric earrings', 'Shifting color choker'],
        styleTheme: 'Hologram Light — iridescent shifts, translucent layers, and spectral color',
    },
    Void: {
        tops: ['Pure matte black void-ink crop top', 'Deepest black structured top with negative-space cut outs', 'Black anti-reflective structured blouse'],
        bottoms: ['Void black maxi skirt that absorbs light', 'Matte black wide-leg trousers', 'Deep black asymmetric skirt'],
        dresses: ['All-void matte black maxi dress', 'Deep black column dress with hidden seams', 'Negative-space black shift dress'],
        shoes: ['Matte black platform ankle boots', 'All-black minimal pointed flats', 'Pure black soft-sole boots'],
        layers: ['Void black longline coat', 'All-black structured wrap', 'Matte black full duster'],
        accessories: ['Small dark matter particle earrings', 'Black star-map choker', 'Dark orb ring'],
        styleTheme: 'Event Horizon — pure matte blacks and absence of color as design',
    },
    Corrupted: {
        tops: ['Glitched black-and-red corrupted print crop top', 'Torn white top with error-ink bleeds', 'Broken data-stripe black structured top'],
        bottoms: ['Corrupted print black mini skirt with red static', 'Torn and patched dark jeans with error stitching', 'Corrupted glitch-print wide-leg pants'],
        dresses: ['Black dress with corrupted red-ink seam splatter', 'Error-torn white dress over black underlayer', 'Corrupted bodycon dress with glitch panels'],
        shoes: ['Cracked-finish platform boots', 'Error-mark black combat boots', 'Corrupted white sneakers with paint bleeds'],
        layers: ['Torn black hoodie with red corruption marks', 'Error-code print jacket', 'Broken-edge black asymmetric coat'],
        accessories: ['Cracked crystal headpiece', 'Error code glitch collar', 'Corrupted wing hair clip'],
        styleTheme: 'Corrupted Signal — blacks shattered by red error bleeds and white glitch cracks',
    },
    Pixel: {
        tops: ['8-bit sprite print crop top', 'Pixel art heart graphic tee', 'Retro game color-block crop top in primary colors'],
        bottoms: ['Pixel art mini skirt in game-color blocks', 'Retro 8-bit print short shorts', 'Color-block pixel wide-leg pants'],
        dresses: ['8-bit sprite print mini dress', 'Retro game color-block dress', 'Pixel art character print skater dress'],
        shoes: ['Chunky pixel sneakers with 8-bit sole design', 'Retro color-block platform shoes', '8-bit print canvas sneakers'],
        layers: ['8-bit color-block bomber jacket', 'Pixel print varsity jacket', 'Retro game print zip hoodie'],
        accessories: ['8-bit pixel crown', 'Game controller charm necklace', 'Pixel heart hair clips'],
        styleTheme: 'Retro 8-Bit — bold primary colors, pixel art prints, and game culture nostalgia',
    },
    Bunny: {
        tops: ['Cream off-shoulder ruffled blouse', 'Soft pink cropped sweater with tiny bow detail', 'White lacy cami top with ribbon straps'],
        bottoms: ['Cream petal mini skirt with fluffy trim', 'Soft pink high-waisted shorts with bow pockets', 'White layered tulle mini skirt'],
        dresses: ['Cream bunny-print babydoll dress', 'Soft pink ruffle-collar mini dress', 'White and pink A-line sundress'],
        shoes: ['Cream ribbon-tie mary janes', 'Pink round-toe flats with bow', 'Soft white bunny slipper-style shoes'],
        layers: ['Cream fluffy cardigan', 'Pink bunny-ear hoodie', 'White ruffled cropped jacket'],
        accessories: ['White fluffy bunny ears headband', 'Pink carrot charm necklace', 'Cream ribbon bow clip'],
        styleTheme: 'Cream and Blush — soft whites, delicate pinks, and plush textures',
    },
    Cat: {
        tops: ['Black oversized tee knotted to one side', 'Dark grey fitted ribbed crop top', 'Soft amber off-shoulder top'],
        bottoms: ['Black pleated mini skirt', 'Grey cat-print high-waisted shorts', 'Amber and black color-block mini skirt'],
        dresses: ['Cat-print black sundress', 'Dark grey wrap mini dress', 'Amber and black color-block dress'],
        shoes: ['Black ballet flats with cat charm', 'Dark grey platform sneakers', 'Amber-toned loafers'],
        layers: ['Black cropped cat-ear hoodie', 'Dark grey zip cardigan', 'Soft amber faux fur collar jacket'],
        accessories: ['Cat ear headband', 'Bell collar choker', 'Paw print charm bracelet'],
        styleTheme: 'Tabby Casual — blacks, warm greys, and amber tones with cat motifs',
    },
    Bear: {
        tops: ['Warm brown chunky knit crop sweater', 'Honey-toned ribbed turtleneck', 'Camel oversized cozy tee'],
        bottoms: ['Warm brown corduroy mini skirt', 'Honey-toned wide-leg trousers', 'Camel knit midi skirt'],
        dresses: ['Brown bear-print cozy sweater dress', 'Warm honey knit dress with button front', 'Camel wrap dress with ribbed texture'],
        shoes: ['Brown chunky boots', 'Honey-toned loafers', 'Camel platform sandals'],
        layers: ['Oversized brown bear-ear hoodie', 'Honey-toned shearling jacket', 'Camel chunky longline cardigan'],
        accessories: ['Brown bear ear headband', 'Honey jar charm necklace', 'Warm brown paw-print ribbon'],
        styleTheme: 'Forest Honey — warm browns, amber honeys, and cozy plush textures',
    },
    Doll: {
        tops: ['Porcelain white lace puff-sleeve blouse', 'Pale pink satin bow-collar top', 'Ivory structured corset with lace overlay'],
        bottoms: ['White lace-trim petticoat skirt', 'Pale pink satin A-line skirt', 'Ivory layered lace midi skirt'],
        dresses: ['Porcelain white lolita dress with lace tiers', 'Pale pink Victorian doll dress with bonnet detail', 'Ivory satin ballgown with lace appliqué'],
        shoes: ['White T-strap lolita shoes with bow', 'Pale pink mary janes with button strap', 'Ivory doll shoes with lace cuff'],
        layers: ['White lace bolero jacket', 'Pale pink velvet short cape', 'Ivory sheer full-sleeve overlay'],
        accessories: ['Porcelain white bonnet with ribbons', 'Button eye hair clips', 'Pale pink key wind-up brooch'],
        styleTheme: 'Porcelain Lolita — ivory whites, pale pinks, and Victorian lace detail',
    },
    Plush: {
        tops: ['Squishy pink knit crop top with heart patch', 'Soft yellow puff-sleeve top with stitching detail', 'Lavender fluffy cropped sweater with plush trim'],
        bottoms: ['Patchwork mini skirt in soft pastels', 'Squishy pink knit mini skirt', 'Soft yellow A-line skirt with heart appliqué'],
        dresses: ['Patchwork plush dress in soft rainbow', 'Squishy knit babydoll dress', 'Plush yarn-textured dress with heart buttons'],
        shoes: ['Soft pink round-toe flats with plush lining', 'Yellow knit slipper-style shoes', 'Lavender platform sneakers with plush tongue'],
        layers: ['Oversized patchwork plush cardigan', 'Squishy pink zip hoodie', 'Soft rainbow patchwork jacket'],
        accessories: ['Yarn pom-pom hair ties', 'Plush star patch hair clip', 'Felt heart earrings'],
        styleTheme: 'Patchwork Plush — soft pastels, knit textures, and sewn-with-love details',
    },
    Idol: {
        tops: ['Sparkle pink idol stage crop top with star trim', 'Sky blue ruffled blouse with silver sparkle', 'Gold sequin structured crop top'],
        bottoms: ['Pink sparkle mini skirt with star appliqués', 'Sky blue pleated idol skirt', 'Gold sequin hot pants'],
        dresses: ['Pink holographic idol concert dress', 'Sky blue sparkle ruffle performance dress', 'Gold sequin show dress with star detail'],
        shoes: ['Pink platform stage boots', 'Sky blue sparkle heeled sandals', 'Gold idol ankle boots'],
        layers: ['Pink sparkle cropped blazer', 'Sky blue sequin shrug', 'Gold structured idol jacket'],
        accessories: ['Pink star halo headpiece', 'Sky blue microphone accessory', 'Gold star-shaped earrings'],
        styleTheme: 'Stage Sparkle — idol pinks, star blues, and sequin performance glam',
    },
    'Magical Girl': {
        tops: ['Hot pink magical heart crop top with star trim', 'White structured magical bodice with gold detail', 'Pink and gold princess crop top'],
        bottoms: ['Hot pink tiered magical girl skirt with ribbon', 'White and gold pleated transformation skirt', 'Pink star-print mini skirt'],
        dresses: ['Hot pink magical girl transformation dress with puff sleeves', 'White and gold princess dress with star overlay', 'Pink sparkle layered magical dress'],
        shoes: ['Hot pink ankle boots with star buckle', 'White magical girl platform shoes', 'Pink ribbon-tie heeled sandals'],
        layers: ['White magical girl capelet with star clasp', 'Pink sheer overlay with star print', 'Gold-trimmed pink structured jacket'],
        accessories: ['Pink tiara with heart gem', 'Star wand prop accessory', 'Gold star-drop earrings'],
        styleTheme: 'Sparkle Transformation — hot pinks, pure whites, and gold star detail',
    },
    Trickster: {
        tops: ['Patchwork diamond-print harlequin crop top', 'Purple and gold fitted structured top', 'Playing card print tee with heart motifs'],
        bottoms: ['Diamond-patterned harlequin mini skirt', 'Purple and gold asymmetric skirt', 'Card suit print mini shorts'],
        dresses: ['Harlequin diamond-print bodycon dress', 'Purple and gold asymmetric hem dress', 'Playing card motif mini dress'],
        shoes: ['Purple and gold pointed court shoes', 'Black platform boots with card suit charm', 'Harlequin diamond-print sneakers'],
        layers: ['Purple and gold harlequin jacket', 'Jester-style asymmetric cape', 'Card print cropped blazer'],
        accessories: ['Playing card fan hairpiece', 'Purple and gold masquerade mask', 'Diamond-pattern choker'],
        styleTheme: 'Harlequin Illusion — purples, golds, and diamond trick-pattern detail',
    },
    Clown: {
        tops: ['Oversized polka-dot ruffle crop top in red and white', 'Pom-pom trimmed yellow structured top', 'Rainbow stripe crop top with large bow'],
        bottoms: ['Red and white polka-dot puffball mini skirt', 'Oversized rainbow stripe shorts', 'Yellow circus-print wide-leg pants'],
        dresses: ['Red and white polka-dot puffball clown dress', 'Rainbow stripe layered circus dress', 'Yellow pom-pom trim balloon dress'],
        shoes: ['Oversized red platform shoes', 'Rainbow stripe chunky boots', 'Yellow pointed clown-toe shoes with pom'],
        layers: ['Rainbow pom-pom trim cropped jacket', 'Oversized polka-dot trench', 'Red and white striped blazer'],
        accessories: ['Red clown nose', 'Pom-pom hat', 'Balloon animal wrist corsage'],
        styleTheme: 'Circus Chaos — bold polka dots, circus stripes, and maximum pom-pom energy',
    },
    Jester: {
        tops: ['Purple and gold split-color jester crop top', 'Motley diamond-pattern fitted top', 'Bell-trimmed purple structured blouse'],
        bottoms: ['Split purple-gold jester mini skirt', 'Diamond motley pattern shorts', 'Bell-hem asymmetric skirt'],
        dresses: ['Purple and gold split jester dress with bell trim', 'Motley diamond mini dress', 'Asymmetric jester gown with bells'],
        shoes: ['Split purple-gold pointed shoes with bell tips', 'Motley platform boots', 'Jester-toe curled platform shoes'],
        layers: ['Split jester capelet with bells', 'Purple and gold motley jacket', 'Asymmetric bell-trim court coat'],
        accessories: ['Jester three-point hat with bells', 'Motley diamond choker', 'Bell wrist cuffs'],
        styleTheme: 'Court Motley — purple-gold splits, diamond patterns, and bell accents',
    },
    Gremlin: {
        tops: ['Muddy green graphic tee with chaotic print', 'Yellow and green patchwork crop top', 'Torn dark tee with goggles print'],
        bottoms: ['Green ripped shorts with chaotic patch pockets', 'Dark yellow camo mini skirt', 'Patchwork green cargo shorts'],
        dresses: ['Patchwork chaotic mini dress in green and yellow', 'Gremlin-print torn dress', 'Dark green chaotic pinafore'],
        shoes: ['Scuffed green platform boots', 'Yellow chunky sneakers (one lace missing)', 'Dark green mismatched kicks'],
        layers: ['Oversized patched green hoodie', 'Yellow torn cropped jacket', 'Patchwork dark chaotic overshirt'],
        accessories: ['Broken goggles on forehead', 'Shiny object charm necklace (many items)', 'Asymmetric fingerless gloves'],
        styleTheme: 'Goblin Chaos — murky greens, chaotic yellows, and found-object styling',
    },
    'Chaos Entity': {
        tops: ['Impossible-print top in colors that shift as you look', 'All-over chaos print crop top', 'Void and neon swirl structured top'],
        bottoms: ['Reality-shifting print mini skirt', 'Color-glitch wide-leg pants', 'Void swirl asymmetric skirt'],
        dresses: ['Impossible color-shift bodycon dress', 'Chaos swirl maxi dress', 'Reality-fracture mini dress'],
        shoes: ['Void-print platform boots', 'Impossible color chunk sneakers', 'Reality-shifting sandals'],
        layers: ['Cosmic chaos swirl longline coat', 'Void-and-color duster', 'Impossible geometry jacket'],
        accessories: ['Floating star halo', 'Reality tear hair accessory', 'Impossible geometry ring set'],
        styleTheme: 'Beyond Category — impossible color combinations and reality-defying details',
    },
    Sleepy: {
        tops: ['Lavender oversized soft tee', 'Periwinkle cloud-print pajama crop top', 'Dusty blue cozy knit top'],
        bottoms: ['Lavender plaid pajama shorts', 'Soft blue cloud-print wide-leg pajama pants', 'Dusty purple knit mini skirt'],
        dresses: ['Lavender oversized sleep-shirt dress', 'Soft cloud-print babydoll dress', 'Cozy periwinkle knit dress'],
        shoes: ['Soft lavender slippers with cloud detail', 'Periwinkle slide sandals', 'Dusty blue knit sneakers'],
        layers: ['Oversized lavender zip hoodie', 'Cloud-print pajama robe', 'Dusty blue loose cardigan'],
        accessories: ['Cloud sleep mask pushed up as headband', 'Star hair clips', 'Lavender moon pendant'],
        styleTheme: 'Midnight Cozy — soft lavenders, cloud blues, and pajama-hour comfort',
    },
    Obsessed: {
        tops: ['Deep rose structured corset top with heart lace', 'Dusty pink blouse with pressed flower detail', 'Burgundy fitted crop top with heart buttons'],
        bottoms: ['Deep rose asymmetric skirt with heart trim', 'Dusty pink flared midi skirt', 'Burgundy mini skirt with lace overlay'],
        dresses: ['Dusty rose pin-up dress with heart print', 'Burgundy wrap dress with pressed flower detail', 'Deep rose babydoll dress with heart appliqués'],
        shoes: ['Deep rose pointed flats with heart buckle', 'Dusty pink mary janes', 'Burgundy ankle strap heeled sandals'],
        layers: ['Rose velvet cropped jacket with heart buttons', 'Dusty pink sheer duster with flower detail', 'Burgundy structured blazer'],
        accessories: ['Locket necklace (definitely has photos inside)', 'Heart-shaped hair clips in rose and pink', 'Pressed flower earrings'],
        styleTheme: 'Devotion Rose — deep pinks, dusty roses, and heart motifs everywhere',
    },
    Yandere: {
        tops: ['Sweet pink ruffled sailor blouse', 'White structured top with pink bow collar', 'Pale pink lace-trim crop top'],
        bottoms: ['Pink plaid school mini skirt', 'White A-line skirt with red detail', 'Pale pink pleated mini skirt'],
        dresses: ['Sweet pink school uniform dress with white collar', 'White and pink babydoll dress with bow', 'Innocent pale pink A-line dress'],
        shoes: ['White mary janes with pink strap', 'Pale pink round-toe flats', 'White school loafers with pink ribbon'],
        layers: ['Pink school cardigan', 'White structured blouse overshirt', 'Pale pink sailor jacket'],
        accessories: ['Pink hair ribbon bow', 'Red rose tucked in outfit', 'Heart locket (on a very long chain)'],
        styleTheme: 'Sweet Devotion — innocent pinks, pure whites, and a single red rose',
    },
    Royal: {
        tops: ['Deep purple velvet structured bustier', 'Gold-embroidered royal blouse', 'Imperial blue satin corset top'],
        bottoms: ['Deep purple ballgown skirt with gold trim', 'Gold-trimmed royal blue train skirt', 'Imperial velvet wide-leg trousers'],
        dresses: ['Deep purple velvet ballgown with gold filigree', 'Royal blue and gold structured gown', 'Imperial purple floor-length dress'],
        shoes: ['Gold-heeled court shoes', 'Deep purple velvet pointed heels', 'Imperial blue embroidered platform shoes'],
        layers: ['Royal ermine-trim velvet cape', 'Gold-lined deep purple longline coat', 'Imperial blue structured royal cloak'],
        accessories: ['Ornate jeweled crown', 'Royal scepter prop accessory', 'Deep purple and gold statement necklace'],
        styleTheme: 'Imperial Grandeur — deep purples, burnished golds, and regal layering',
    },
    'Prince/Princess': {
        tops: ['Soft gold satin structured blouse', 'Fairytale blue puff-sleeve top', 'Dusty rose princess structured crop top'],
        bottoms: ['Soft gold ballgown skirt with glitter hem', 'Fairytale blue layered princess skirt', 'Dusty rose tulle A-line skirt'],
        dresses: ['Soft gold princess ballgown with puff sleeves', 'Fairytale blue Cinderella gown', 'Dusty rose romantic princess dress'],
        shoes: ['Glass-effect clear heeled sandals', 'Soft gold pointed flats', 'Fairytale blue ribbon-tie heels'],
        layers: ['Soft gold royal capelet', 'Fairytale blue velvet stole', 'Dusty rose structured fairy-tale coat'],
        accessories: ['Delicate diamond tiara', 'Fairytale blue ribbon sash', 'Soft gold star-drop earrings'],
        styleTheme: 'Fairytale Gold — soft golds, romantic blues, and princess silhouettes',
    },
    Knight: {
        tops: ['Dark silver armored structured top', 'Deep blue fitted tunic with silver detail', 'Dark iron grey chainmail-print blouse'],
        bottoms: ['Dark silver armored skirt with plate detail', 'Deep blue fitted trousers with silver stripe', 'Dark grey pleated tactical skirt'],
        dresses: ['Silver armored bodice dress with navy skirt', "Dark blue fitted knight's tunic dress", 'Iron grey structured gown with armor accent'],
        shoes: ['Dark silver armored boots', 'Deep blue pointed boots with silver clasp', 'Dark iron grey combat boots'],
        layers: ['Silver armor plate shoulder cape', 'Deep blue wool military coat', 'Dark grey tactical longline coat'],
        accessories: ['Polished silver sword-cross hair clip', 'Shield emblem brooch', 'Silver pauldron shoulder piece'],
        styleTheme: 'Steel Honor — dark silvers, deep navies, and structured armor elements',
    },
    Assassin: {
        tops: ['All-black fitted tactical crop top', 'Dark crimson armored structured top', 'Shadow grey fitted long-sleeve'],
        bottoms: ['Black slim tactical trousers', 'Dark grey armored mini skirt', 'Crimson and black cargo pants'],
        dresses: ['Sleek all-black bodycon dress with hidden slits', 'Dark operative fitted dress', 'Shadow grey minimal slit dress'],
        shoes: ['Silent black flat tactical boots', 'Dark crimson soft-sole ankle boots', 'All-black minimal pointed flats'],
        layers: ['Dark hooded tactical cloak', 'Shadow black short cape', 'Matte black longline coat'],
        accessories: ['Dark hood pulled back', 'Hidden blade wrist piece', 'Minimal black mask prop'],
        styleTheme: 'Shadow Ops — all blacks, dark crimsons, and minimalist deadly precision',
    },
    Deity: {
        tops: ['White and gold divine structured blouse', 'Celestial pale gold off-shoulder top', 'Sacred ivory lace-trim structured top'],
        bottoms: ['White gold-filigree ballgown skirt', 'Celestial pale gold ombre skirt', 'Sacred ivory and gold flowing wide-leg'],
        dresses: ['Transcendent white and gold goddess gown', 'Celestial ivory flowing divine dress', 'Sacred white satin column dress with gold detail'],
        shoes: ['White and gold platform sandals', 'Celestial gold pointed flats', 'Ivory heeled divine mules'],
        layers: ['White divine celestial cloak', 'Gold-lined sheer sacred robe overlay', 'Ivory trailing divine stole'],
        accessories: ['Divine crown of stars', 'Sacred celestial halo', 'Gold sacred symbol pendant'],
        styleTheme: 'Divine Transcendence — pure whites, sacred golds, and flowing celestial lines',
    },
};

const MOOD_FIT = {
    happy: 'This outfit radiates warmth — the colors are open and inviting, perfect for a good-mood day.',
    sad: 'Soft and slightly muted tones — comforting without demanding attention.',
    excited: 'Bold and eye-catching — an outfit that matches maximum energy.',
    bored: 'Effortlessly put-together with zero effort visible. That\'s the move.',
    jealous: 'Sharp and intentional — an outfit that says "I noticed everything."',
    loving: 'Soft, warm, and approachable — it says everything she won\'t.',
    sleepy: 'Cozy-coded but still coordinated. She got dressed. That\'s enough.',
    angry: 'Structured, deliberate, and with an edge. Not an accident.',
    confused: 'Slightly mismatched in a way that actually works — accidentally iconic.',
    content: 'Perfectly balanced. Nothing too loud, nothing too quiet. Just right.',
};

const ENERGY_FIT = {
    chaotic: 'Every piece says "I made a decision and I\'m not explaining it."',
    sweet: 'Soft and intentional — chosen with care for how others will feel around it.',
    jealous: 'Curated to be undeniable. She dressed to be noticed.',
    calm: 'Measured and clean — no excess, nothing wasted.',
    spicy: 'Every piece has an edge. Worn casually. That\'s the whole point.',
    dreamy: 'Floaty, slightly unfocused, like a thought you can\'t quite hold.',
    fierce: 'Sharp silhouettes and deliberate lines. Power made visible.',
    shy: 'Soft pieces in quiet tones — armor for someone who prefers to go unnoticed.',
    bold: 'Statement everything. Zero apologies.',
    mysterious: 'Layers upon layers. You see the surface. The rest is not for you.',
    playful: 'Fun details everywhere — it\'s fashion but also clearly enjoying itself.',
    serious: 'Precise and understated. The outfit is not the point. She is.',
    dramatic: 'Structured for maximum impact in any room she enters.',
    chill: 'Relaxed and unfussed — looks good without trying.',
    obsessive: 'Hyperfocused on one motif, repeated throughout. It works.',
    gentle: 'Everything is soft at the edges — including how it\'s put together.',
    feral: 'Technically an outfit. Held together by confidence and spite.',
    soft: 'Cozy-coded with no sharp edges anywhere.',
    intense: 'Every element chosen with precision. Nothing decorative.',
    bubbly: 'Layers of joy — ruffles, bows, color — stacked without fear.',
};

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

module.exports = {
    data: new SlashCommandBuilder()
        .setName('outfit')
        .setDescription("Generate a full coordinated outfit for your mascot! 👗"),

    async execute(interaction) {
        const mascot = getMascot(interaction.user.id, interaction.guildId);
        if (!mascot) {
            return interaction.reply({ content: "You don't have a mascot yet! Use `/mascot` to generate one. ✨", ephemeral: true });
        }

        const data = OUTFIT_DATA[mascot.type] || OUTFIT_DATA.Pastel;
        const c = mascot.colors;

        const useDress = Math.random() < 0.35;
        const top = useDress ? null : pick(data.tops);
        const bottom = useDress ? null : pick(data.bottoms);
        const dress = useDress ? pick(data.dresses) : null;
        const shoes = pick(data.shoes);
        const layer = pick(data.layers);
        const accessory = pick(data.accessories);
        const moodFit = MOOD_FIT[mascot.mood] || MOOD_FIT.content;
        const energyFit = ENERGY_FIT[mascot.energy] || 'Styled true to her nature.';

        const outfitLines = useDress
            ? `👗 **Dress:** ${dress}`
            : `👕 **Top:** ${top}\n👖 **Bottom:** ${bottom}`;

        const embed = new EmbedBuilder()
            .setTitle(`👗 OUTFIT GENERATED FOR ${mascot.name.toUpperCase()}`)
            .setDescription(`*Styled for a ${mascot.emoji} ${mascot.type} with **${mascot.energy}** energy.*`)
            .setColor(getMoodColor(mascot.mood))
            .addFields(
                {
                    name: '✨ The Look',
                    value: `${outfitLines}\n👟 **Shoes:** ${shoes}\n🧥 **Layer:** ${layer}\n🎀 **Accessory:** ${accessory}`,
                    inline: false,
                },
                {
                    name: '🎨 Style Theme',
                    value: data.styleTheme,
                    inline: false,
                },
                {
                    name: '💖 Mood Fit',
                    value: `${moodFit}\n*${energyFit}*`,
                    inline: false,
                },
                {
                    name: '🎨 Palette Colors',
                    value: `Top: \`${c.outfit.top}\`  Bottom: \`${c.outfit.bottom}\`  Outline: \`${c.outfit.outline}\``,
                    inline: false,
                },
            )
            .setFooter({ text: `${mascot.colors.paletteName} palette • Fashion is identity. 🌸` });

        await interaction.reply({ embeds: [embed] });
    },
};
