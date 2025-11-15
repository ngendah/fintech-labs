Getting Started:
=======
1. Ensure docker is installed.
2. run the load script
```sh
./load-test.sh
```


Sample Output:
=======
```
█ THRESHOLDS 

    http_req_duration
    ✓ 'p(95)<100' p(95)=93.22ms


  █ TOTAL RESULTS 

    checks_total.......: 878     14.142035/s
    checks_succeeded...: 100.00% 878 out of 878
    checks_failed......: 0.00%   0 out of 878

    ✓ register 201
    ✓ booking 201

    CUSTOM
    booking_duration...............: avg=8.892938  p(95)=11      max=41      
    register_duration..............: avg=91.788155 p(95)=98.1    max=120     

    HTTP
    http_req_duration..............: avg=50.2ms    p(95)=93.22ms max=119.29ms
      { expected_response:true }...: avg=50.2ms    p(95)=93.22ms max=119.29ms
    http_req_failed................: 0.00%  0 out of 878
    http_reqs......................: 878    14.142035/s

    EXECUTION
    iteration_duration.............: avg=2.1s      p(95)=2.1s    max=2.16s   
    iterations.....................: 439    7.071017/s
    vus............................: 3      min=1        max=49
    vus_max........................: 50     min=50       max=50

    NETWORK
    data_received..................: 319 kB 5.1 kB/s
    data_sent......................: 268 kB 4.3 kB/s
```
