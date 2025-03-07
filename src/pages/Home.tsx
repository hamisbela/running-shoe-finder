import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Upload, Search, Footprints, Loader2 } from 'lucide-react';
import { analyzeImage } from '../lib/gemini';
import SupportBlock from '../components/SupportBlock';

// Default image path
const DEFAULT_IMAGE = "/default-running-shoe.webp"; 

// Default analysis for the running shoe image
const DEFAULT_ANALYSIS = `## Running Shoe Analysis

### Brand & Model Identification
🏷️ **Verdict: Nike Air Zoom Pegasus 38 (95% confidence)**

This is a Nike Air Zoom Pegasus 38 in the "White/Black/Flash Crimson" colorway based on the distinctive engineered mesh upper, signature swoosh design, and visible Air Zoom branding on the midsole.

### Style Details

1. **Design Elements:**
   - Clean white engineered mesh upper with breathable perforations
   - Black heel counter with padded collar for ankle support
   - Metallic silver Nike swoosh logo on sides
   - Red and blue/purple accent stitching along the midfoot
   - Traditional lace-up closure with reinforced eyelets
   - Sleek profile characteristic of neutral road running shoes
   - "Air Zoom" branding visible on the midsole

2. **Material Analysis:**
   - Engineered mesh upper for lightweight breathability
   - React foam midsole with Zoom Air unit in forefoot
   - Durable rubber outsole with waffle-inspired pattern
   - Reinforced toe cap for additional protection
   - Cushioned insole for added comfort

3. **Color Profile:**
   - Primary: White/Summit White base
   - Secondary: Black heel and details
   - Accent: Metallic silver swoosh
   - Highlights: Flash Crimson (red) and purple/blue stitching details
   - Clean, versatile colorway suitable for various outfits and running conditions

4. **Running Specialty:**
   - Daily training road runner
   - Neutral pronation support
   - Versatile for various distances (5K to marathon)
   - Designed primarily for road surfaces
   - All-season performance shoe

### Performance Features

1. **Cushioning System:**
   - React foam midsole provides responsive, lightweight cushioning
   - Zoom Air unit in forefoot for added responsiveness and energy return
   - 10mm heel-to-toe drop (standard for Nike Pegasus line)
   - Balanced stack height for good ground feel and impact protection
   - Responsive yet cushioned ride

2. **Support Characteristics:**
   - Neutral support design for runners with normal arches
   - Midfoot band system integrated with laces for secure lockdown
   - Structured heel counter prevents excess movement
   - Wider forefoot than previous models allowing for natural toe splay
   - Stable platform for consistent landings

3. **Traction & Durability:**
   - High-abrasion rubber in high-wear areas for longevity
   - Waffle-inspired traction pattern for multi-surface grip
   - Strategic flex grooves for natural foot movement
   - Expected lifespan of 400-500 miles for average runners
   - Good wet and dry surface performance

4. **Weight & Responsiveness:**
   - Approximately 10 oz (283g) for men's size 10
   - Balanced weight-to-cushioning ratio
   - Responsive toe-off with energy return from Zoom Air unit
   - Smooth heel-to-toe transition
   - Nimble feel despite protective cushioning

### Where to Purchase

1. **Official Retailers:**
   - **Nike**: $120.00 - Available on Nike.com and Nike retail stores
   - **Fleet Feet**: $120.00 - Includes professional fitting services
   - **Dick's Sporting Goods**: $120.00 - Widely available in most locations
   - **Running Warehouse**: $120.00 - Free shipping and 90-day returns

2. **Current Discounts (Previous Season Model):**
   - **Nike Factory Outlet**: $89.97 - Limited sizes available
   - **JackRabbit**: $99.95 - Previous season colorways
   - **REI**: $95.73 - Member pricing available
   - **Eastbay**: $89.99 - With promo code "SUMMER"

3. **Similar Alternative Models:**
   - **Brooks Ghost 14**: $130.00 - Similar neutral cushioning profile
   - **ASICS Gel-Cumulus 23**: $120.00 - Comparable daily trainer
   - **Saucony Ride 14**: $130.00 - Alternative neutral option
   - **New Balance Fresh Foam 880v12**: $134.99 - Similar purpose and feel

### Recommended Usage

1. **Best For:**
   - Daily training runs (3-15 miles)
   - Neutral runners with medium to high arches
   - Road, track, and light gravel surfaces
   - Tempo runs and long slow distance training
   - Beginners to advanced recreational runners

2. **Less Ideal For:**
   - Severe overpronators needing stability features
   - Technical trail running
   - Elite-level competition/racing
   - Runners seeking maximum cushioning

3. **Maintenance Tips:**
   - Remove insoles and loosen laces for drying if shoes get wet
   - Clean with mild soap and damp cloth when dirty
   - Rotate with another pair to extend shoe life
   - Replace after approximately 300-500 miles of running
   - Store at room temperature away from direct sunlight

This versatile, well-cushioned daily trainer continues Nike's long-standing Pegasus tradition as a reliable workhorse for all types of runners. The Pegasus 38 offers a blend of responsiveness, durability, and comfort that makes it suitable for everything from recovery jogs to tempo workouts, living up to its reputation as Nike's best-selling running shoe line.`;

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load default image and analysis without API call
    const loadDefaultContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(DEFAULT_IMAGE);
        if (!response.ok) {
          throw new Error('Failed to load default image');
        }
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setImage(base64data);
          setAnalysis(DEFAULT_ANALYSIS);
          setLoading(false);
        };
        reader.onerror = () => {
          setError('Failed to load default image');
          setLoading(false);
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error('Error loading default image:', err);
        setError('Failed to load default image');
        setLoading(false);
      }
    };

    loadDefaultContent();
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError('Image size should be less than 20MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImage(base64String);
      setError(null);
      handleAnalyze(base64String);
    };
    reader.onerror = () => {
      setError('Failed to read the image file. Please try again.');
    };
    reader.readAsDataURL(file);

    // Reset the file input so the same file can be selected again
    e.target.value = '';
  }, []);

  const handleAnalyze = async (imageData: string) => {
    setLoading(true);
    setError(null);
    try {
      // Using the default prompt from gemini.ts which now focuses on running shoe identification
      const result = await analyzeImage(imageData);
      setAnalysis(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze image. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatAnalysis = (text: string) => {
    const lines = text.split('\n');
    let currentSection = '';
    
    return lines.map((line, index) => {
      // H2 headers (##)
      if (line.startsWith('## ')) {
        currentSection = line.replace('## ', '').trim();
        return (
          <h2 key={index} className="text-2xl font-bold text-green-700 mt-8 mb-4">
            {currentSection}
          </h2>
        );
      }
      
      // H3 headers (###)
      if (line.startsWith('### ')) {
        currentSection = line.replace('### ', '').trim();
        return (
          <h3 key={index} className="text-xl font-bold text-green-600 mt-6 mb-3">
            {currentSection}
          </h3>
        );
      }
      
      // Bold with emoji verdict
      if (line.includes('**Verdict:')) {
        const [prefix, content] = line.split('**Verdict:');
        const verdictContent = content.split('**')[0];
        const remainder = content.split('**')[1] || '';
        
        return (
          <p key={index} className="text-lg font-bold mb-4">
            {prefix}<span className="text-green-700 font-bold">Verdict: {verdictContent}</span>{remainder}
          </p>
        );
      }
      
      // Numbered list items with bold headings - section headings
      if (/^\d+\.\s\*\*[^*]+\*\*:?$/.test(line)) {
        const number = line.match(/^\d+/)?.[0] || '';
        const title = line.match(/\*\*([^*]+)\*\*/)?.[1] || '';
        
        return (
          <p key={index} className="font-bold text-gray-900 mt-4 mb-2">
            {number}. {title}
          </p>
        );
      }
      
      // Numbered list items with bold text - items with descriptions
      if (/^\d+\.\s\*\*[^*]+\*\*:/.test(line)) {
        const number = line.match(/^\d+/)?.[0] || '';
        const title = line.match(/\*\*([^*]+)\*\*/)?.[1] || '';
        const restOfLine = line.replace(/^\d+\.\s\*\*[^*]+\*\*:/, '').trim();
        
        return (
          <div key={index} className="mb-3">
            <p className="font-semibold text-gray-900">
              {number}. <span className="font-bold">{title}:</span>{restOfLine}
            </p>
          </div>
        );
      }
      
      // Brand mentions with prices (lines that start with a dash and have bold text and pricing)
      if (line.trim().startsWith('- **') && line.includes('"') && line.includes('$')) {
        const brandMatch = line.match(/\*\*([^*]+)\*\*/);
        const quotedTextMatch = line.match(/"([^"]+)"/);
        const priceMatch = line.match(/\$\d+\.\d+/);
        
        const brand = brandMatch ? brandMatch[1] : '';
        const itemName = quotedTextMatch ? quotedTextMatch[1] : '';
        const price = priceMatch ? priceMatch[0] : '';
        
        // Any text after price
        const afterPrice = line.split(price)[1] || '';
        
        return (
          <li key={index} className="ml-6 mb-2 list-none relative">
            <span className="absolute -left-4 top-1.5 w-2 h-2 rounded-full bg-green-500"></span>
            <span className="font-bold text-gray-800">{brand}</span>: "{itemName}" - <span className="text-green-700">{price}</span>{afterPrice}
          </li>
        );
      }
      
      // Indented bullet points (with leading spaces)
      if (line.trim().startsWith('- ') && line.startsWith('   -')) {
        return (
          <li key={index} className="ml-10 mb-2 list-none relative">
            <span className="absolute -left-4 top-1.5 w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-gray-700">{line.trim().substring(2)}</span>
          </li>
        );
      }
      
      // Standard bullet points
      if (line.trim().startsWith('- ')) {
        return (
          <li key={index} className="ml-6 mb-2 list-none relative">
            <span className="absolute -left-4 top-1.5 w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-gray-700">{line.trim().substring(2)}</span>
          </li>
        );
      }
      
      // Empty lines
      if (!line.trim()) {
        return <div key={index} className="h-2"></div>;
      }
      
      // Regular text
      return (
        <p key={index} className="mb-3 text-gray-700">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="bg-gray-50 py-6 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Free Running Shoe Finder By Image</h1>
          <p className="text-base sm:text-lg text-gray-600">Upload any running shoe photo and instantly identify the brand, model, and get performance details</p>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-12 border border-gray-200">
          <div className="flex flex-col items-center justify-center mb-6">
            <label 
              htmlFor="image-upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer w-full sm:w-auto"
            >
              <Upload className="h-5 w-5" />
              Upload Running Shoes to Identify
              <input
                ref={fileInputRef}
                id="image-upload"
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleImageUpload}
              />
            </label>
            <p className="mt-2 text-sm text-gray-500">PNG, JPG, JPEG or WEBP (MAX. 20MB)</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {loading && !image && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="animate-spin h-8 w-8 text-green-600" />
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          )}

          {image && (
            <div className="mb-6">
              <div className="relative rounded-lg mb-4 overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={image}
                  alt="Running shoes to analyze"
                  className="w-full h-auto max-h-[500px] object-contain mx-auto"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAnalyze(image)}
                  disabled={loading}
                  className="flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="-ml-1 mr-2 h-5 w-5" />
                      Identify Shoes
                    </>
                  )}
                </button>
                <button
                  onClick={triggerFileInput}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Another Image
                </button>
              </div>
            </div>
          )}

          {analysis && (
            <div className="bg-gray-50 rounded-lg p-6 sm:p-8 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Footprints className="h-7 w-7 text-green-600 mr-2" />
                Running Shoe Analysis
              </h2>
              <div className="text-gray-700">
                {formatAnalysis(analysis)}
              </div>
            </div>
          )}
        </div>

        <SupportBlock />

        <div className="prose max-w-none my-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Free Running Shoe Finder By Image: Identify Running Shoes Instantly</h2>
          
          <p>Welcome to our cutting-edge <strong>free running shoe finder by image</strong> tool, designed to help you identify running shoe brands, models, and performance features with exceptional accuracy. In today's vast athletic footwear landscape, finding the perfect running shoes you spotted can be challenging – our <strong>free running shoe finder by image</strong> is here to help.</p>

          <h3>How Our Free Running Shoe Finder By Image Works</h3>
          <p>Our sophisticated <strong>free running shoe finder by image</strong> uses advanced artificial intelligence to analyze uploaded running shoe photos and identify their brands, models, and performance characteristics. Simply upload any running shoe image, and our <strong>free running shoe finder by image</strong> will provide a comprehensive analysis. Whether you're a casual jogger, competitive runner, or fitness enthusiast, our <strong>free running shoe finder by image</strong> gives you the insights you need.</p>

          <h3>Why Choose Our Free Running Shoe Finder By Image</h3>
          <ul>
            <li>Advanced AI running shoe recognition technology that identifies brands and models</li>
            <li>Detailed analysis of shoe performance features like cushioning, support, and intended use</li>
            <li>Comprehensive shopping guides with multiple purchasing options at various price points</li>
            <li>Fast processing with instant results for any running shoes you upload</li>
            <li>Personalized recommendations based on shoe characteristics</li>
            <li>100% free to use with no hidden costs or subscriptions</li>
            <li>Privacy-focused approach that doesn't store your uploaded photos</li>
            <li>Regular updates to keep pace with evolving running shoe technology and brands</li>
          </ul>

          <h3>When to Use Our Free Running Shoe Finder By Image:</h3>
          <ul>
            <li>When you spot stylish running shoes and want to know the exact model</li>
            <li>If you're trying to find shoes from a specific brand that match your running style</li>
            <li>When shopping for similar running shoes at different price points</li>
            <li>To understand the performance characteristics of shoes you're interested in</li>
            <li>For finding alternatives to expensive premium running shoes</li>
            <li>When seeking the perfect running shoes for your specific running needs (trail, road, etc.)</li>
          </ul>

          <p>Try our <strong>free running shoe finder by image</strong> today and take the guesswork out of running shoe shopping. No registration required – simply upload a running shoe photo and let our <strong>free running shoe finder by image</strong> analyze it instantly! Our <strong>free running shoe finder by image</strong> tool makes identifying running shoes easier than ever before.</p>
        </div>

        <SupportBlock />
      </div>
    </div>
  );
}