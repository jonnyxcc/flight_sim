/* terrainModeling.js
 * Creates the terrain the plane will fly over using the diamond square algorithm to generate a height map, 
 * then pushing the vertices with the height map to the vertexArray buffer. It also can create the edges, usually
 * for debug purposes.
 */

function diamondSquareHelp(x,y,heightMap)
{
  /* for(var i=0;i<x;i++)
    for(var j=0;j<=y;j++)
      heightMap[i + x*j] = -1/Math.random(); */

  for(var i=0;i<x;i++) //initialize height map
    for(var j=0;j<y;j++)
      heightMap[i + x*j] = 0;

  var range = 1;
  var level = 32;
  diamondSquare(x,y, heightMap, x, range); //call diamondSquare recursive algorthm on the height map
}

function diamondSquare(x,y,heightMap,level,range)
{
  if (level < 1) //base case
    return;

  //Diamond step, initialize center square to average of 4 corners + a random value
  for(var i=level;i<x;i+=level)
    for(var j=level;j<y;j+=level)
    {
      var a = heightMap[(i-level)+x*(j-level)];
      var b = heightMap[i+x*(j-level)];
      var c = heightMap[(i-level)+x*j];
      var d = heightMap[i+x*j];
      heightMap[i-(level/2) + x*(j-(level/2))] = (a+b+c+d)/4 + Math.random()*range; //average 4 + random value, gets smaller each time
    }
  //Square step, initialize 4 parts of the square to the average of the diamonds plus a random value, smaller each time
  for (var i=(2*level);i<x;i+=level)
      for (var j=(2*level);j<y;j+=level)
      {
      var a = heightMap[(i-level)+x*(j-level)];
      var b = heightMap[i+x*(j-level)];
      var c = heightMap[(i-level)+j*x];
      var e = heightMap[i-level/2+x*(j-level/2)];

      heightMap[(i-level)+x*(j-level/2)] = (a + c + e + heightMap[i-(3*level)/2+x*(j-level/2)])/4 + Math.random()*range;
      heightMap[i-(level/2)+x*(j-level)] = (a + b + e + heightMap[i-level/2+x*((j-(3*level)/2))])/4 + Math.random()*range;
      }

      diamondSquare(x,y,heightMap,level/2,range/2) //Reduce range, level, call again
}


//-------------------------------------------------------------------------
function terrainFromIteration(n, minX,maxX,minY,maxY, vertexArray, faceArray,normalArray,heightMap)
{
    var deltaX=(maxX-minX)/n;
    var deltaY=(maxY-minY)/n;
    for(var i=0;i<=n;i++)
       for(var j=0;j<=n;j++)
       {
           vertexArray.push(minX+deltaX*j);
           vertexArray.push(minY+deltaY*i);
           vertexArray.push(heightMap[i+n*j]); //push the height map with each vertex
           
           normalArray.push(0);
           normalArray.push(0);
           normalArray.push(1);
       }

    var numT=0;
    for(var i=0;i<n;i++)
       for(var j=0;j<n;j++)
       {
           var vid = i*(n+1) + j;
           faceArray.push(vid);
           faceArray.push(vid+1);
           faceArray.push(vid+n+1);
           
           faceArray.push(vid+1);
           faceArray.push(vid+1+n+1);
           faceArray.push(vid+n+1);
           numT+=2;
       }
    return numT;
}
//-------------------------------------------------------------------------
function generateLinesFromIndexedTriangles(faceArray,lineArray)
{
    numTris=faceArray.length/3;
    for(var f=0;f<numTris;f++)
    {
        var fid=f*3;
        lineArray.push(faceArray[fid]);
        lineArray.push(faceArray[fid+1]);
        
        lineArray.push(faceArray[fid+1]);
        lineArray.push(faceArray[fid+2]);
        
        lineArray.push(faceArray[fid+2]);
        lineArray.push(faceArray[fid]);
    }
}

//-------------------------------------------------------------------------

