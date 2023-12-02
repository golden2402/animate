#!/bin/bash   

for (( i = 249; i >= 1; i-- ));
do                                                                                                                                                                                  
curl http://localhost:5000/anime/populate/$i
done
