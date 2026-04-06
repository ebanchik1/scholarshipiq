import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";

const SCHOOLS = [
  // SOURCE: 2025 ABA Standard 509 Required Disclosures (Dec 2025 release)
  // LSD.law, ILRG 2026, Spivey 2025 median tracker
  // Grant/scholarship data: ABA 509 scholarship disclosures + school websites
  // wl_rate: estimated from LSD.law historical cycle data by tier
  // OOS/private tuition used throughout

  // ─── T14 ──────────────────────────────────────────────────────────────────
  { name:"Yale Law School",                    usNews:1,  tier:"T14", city:"New Haven", state:"CT",  median_lsat:174,p25_lsat:171,p75_lsat:177,median_gpa:3.96,p25_gpa:3.90,p75_gpa:4.00, tuition:78600, pct_grant:75, pct_half:45, pct_full:20, med_grant:25000, p25_grant:0,     p75_grant:55000, class_size:220,  yield:0.77, seats_pct:0.04, accept_rate:0.0406, wl_rate:0.05 },
  { name:"Stanford Law School",                usNews:2,  tier:"T14", city:"Stanford", state:"CA",  median_lsat:173,p25_lsat:169,p75_lsat:175,median_gpa:3.92,p25_gpa:3.78,p75_gpa:4.00, tuition:79326, pct_grant:72, pct_half:42, pct_full:18, med_grant:22000, p25_grant:0,     p75_grant:52000, class_size:185,  yield:0.70, seats_pct:0.03, accept_rate:0.061,  wl_rate:0.05 },
  { name:"Harvard Law School",                 usNews:3,  tier:"T14", city:"Cambridge", state:"MA",  median_lsat:174,p25_lsat:171,p75_lsat:176,median_gpa:3.96,p25_gpa:3.89,p75_gpa:4.00, tuition:77400, pct_grant:60, pct_half:32, pct_full:12, med_grant:18000, p25_grant:0,     p75_grant:45000, class_size:579,  yield:0.59, seats_pct:0.03, accept_rate:0.092,  wl_rate:0.06 },
  { name:"University of Chicago Law",          usNews:4,  tier:"T14", city:"Chicago", state:"IL",  median_lsat:174,p25_lsat:171,p75_lsat:176,median_gpa:3.97,p25_gpa:3.87,p75_gpa:4.00, tuition:83316, pct_grant:68, pct_half:38, pct_full:15, med_grant:30000, p25_grant:0,     p75_grant:65000, class_size:203,  yield:0.30, seats_pct:0.23, accept_rate:0.0974, wl_rate:0.08 },
  { name:"Penn Carey Law",                     usNews:5,  tier:"T14", city:"Philadelphia", state:"PA",  median_lsat:173,p25_lsat:167,p75_lsat:174,median_gpa:3.95,p25_gpa:3.77,p75_gpa:4.00, tuition:76878, pct_grant:70, pct_half:40, pct_full:16, med_grant:28000, p25_grant:0,     p75_grant:60000, class_size:266,  yield:0.40, seats_pct:0.10, accept_rate:0.106,  wl_rate:0.09 },
  { name:"UVA School of Law",                  usNews:6,  tier:"T14", city:"Charlottesville", state:"VA",  median_lsat:173,p25_lsat:168,p75_lsat:175,median_gpa:3.99,p25_gpa:3.83,p75_gpa:4.04, tuition:73400, pct_grant:65, pct_half:36, pct_full:14, med_grant:22000, p25_grant:0,     p75_grant:52000, class_size:305,  yield:0.43, seats_pct:0.08, accept_rate:0.0966, wl_rate:0.09 },
  { name:"Columbia Law School",                usNews:7,  tier:"T14", city:"New York", state:"NY",  median_lsat:173,p25_lsat:169,p75_lsat:175,median_gpa:3.92,p25_gpa:3.85,p75_gpa:3.98, tuition:84882, pct_grant:55, pct_half:28, pct_full:10, med_grant:18000, p25_grant:0,     p75_grant:42000, class_size:443,  yield:0.47, seats_pct:0.05, accept_rate:0.118,  wl_rate:0.07 },
  { name:"NYU School of Law",                  usNews:8,  tier:"T14", city:"New York", state:"NY",  median_lsat:172,p25_lsat:169,p75_lsat:175,median_gpa:3.92,p25_gpa:3.83,p75_gpa:3.97, tuition:81000, pct_grant:58, pct_half:30, pct_full:11, med_grant:20000, p25_grant:0,     p75_grant:48000, class_size:450,  yield:0.44, seats_pct:0.04, accept_rate:0.156,  wl_rate:0.07 },
  { name:"UC Berkeley School of Law",          usNews:9,  tier:"T14", city:"Berkeley", state:"CA",  median_lsat:170,p25_lsat:167,p75_lsat:172,median_gpa:3.92,p25_gpa:3.84,p75_gpa:3.99, tuition:56000, pct_grant:62, pct_half:34, pct_full:13, med_grant:20000, p25_grant:0,     p75_grant:48000, class_size:374,  yield:0.39, seats_pct:0.06, accept_rate:0.128,  wl_rate:0.08 },
  { name:"Duke University School of Law",      usNews:10, tier:"T14", city:"Durham", state:"NC",  median_lsat:171,p25_lsat:169,p75_lsat:172,median_gpa:3.91,p25_gpa:3.83,p75_gpa:3.96, tuition:79800, pct_grant:72, pct_half:42, pct_full:18, med_grant:28000, p25_grant:5000,  p75_grant:58000, class_size:227,  yield:0.38, seats_pct:0.09, accept_rate:0.098,  wl_rate:0.08 },
  { name:"Northwestern Pritzker Law",          usNews:11, tier:"T14", city:"Chicago", state:"IL",  median_lsat:173,p25_lsat:167,p75_lsat:175,median_gpa:3.96,p25_gpa:3.76,p75_gpa:4.00, tuition:79380, pct_grant:68, pct_half:38, pct_full:15, med_grant:26000, p25_grant:0,     p75_grant:58000, class_size:253,  yield:0.37, seats_pct:0.08, accept_rate:0.148,  wl_rate:0.09 },
  { name:"Cornell Law School",                 usNews:12, tier:"T14", city:"Ithaca", state:"NY",  median_lsat:173,p25_lsat:168,p75_lsat:175,median_gpa:3.92,p25_gpa:3.75,p75_gpa:3.97, tuition:78650, pct_grant:70, pct_half:40, pct_full:16, med_grant:25000, p25_grant:0,     p75_grant:55000, class_size:217,  yield:0.25, seats_pct:0.12, accept_rate:0.1819, wl_rate:0.12 },
  { name:"University of Michigan Law",         usNews:13, tier:"T14", city:"Ann Arbor", state:"MI",  median_lsat:171,p25_lsat:168,p75_lsat:173,median_gpa:3.88,p25_gpa:3.74,p75_gpa:3.95, tuition:67000, pct_grant:68, pct_half:38, pct_full:15, med_grant:22000, p25_grant:0,     p75_grant:48000, class_size:343,  yield:0.43, seats_pct:0.06, accept_rate:0.130,  wl_rate:0.10 },
  { name:"Georgetown Law",                     usNews:14, tier:"T14", city:"Washington", state:"DC",  median_lsat:171,p25_lsat:165,p75_lsat:173,median_gpa:3.93,p25_gpa:3.72,p75_gpa:3.97, tuition:77526, pct_grant:55, pct_half:28, pct_full:10, med_grant:18000, p25_grant:0,     p75_grant:42000, class_size:672,  yield:0.36, seats_pct:0.04, accept_rate:0.157,  wl_rate:0.08 },

  // ─── T25 ──────────────────────────────────────────────────────────────────
  { name:"Vanderbilt Law School",              usNews:15, tier:"T25", city:"Nashville", state:"TN",  median_lsat:170,p25_lsat:167,p75_lsat:171,median_gpa:3.91,p25_gpa:3.77,p75_gpa:3.97, tuition:75732, pct_grant:78, pct_half:50, pct_full:25, med_grant:38000, p25_grant:10000, p75_grant:68000, class_size:173,  yield:0.30, seats_pct:0.10, accept_rate:0.128,  wl_rate:0.10 },
  { name:"UCLA School of Law",                 usNews:16, tier:"T25", city:"Los Angeles", state:"CA",  median_lsat:171,p25_lsat:166,p75_lsat:172,median_gpa:3.95,p25_gpa:3.73,p75_gpa:4.00, tuition:53000, pct_grant:62, pct_half:34, pct_full:13, med_grant:20000, p25_grant:0,     p75_grant:48000, class_size:328,  yield:0.31, seats_pct:0.06, accept_rate:0.1205, wl_rate:0.10 },
  { name:"University of Texas Law",            usNews:17, tier:"T25", city:"Austin", state:"TX",  median_lsat:172,p25_lsat:166,p75_lsat:173,median_gpa:3.89,p25_gpa:3.75,p75_gpa:3.96, tuition:60000, pct_grant:65, pct_half:36, pct_full:14, med_grant:22000, p25_grant:0,     p75_grant:50000, class_size:373,  yield:0.40, seats_pct:0.06, accept_rate:0.163,  wl_rate:0.10 },
  { name:"Washington University Law",          usNews:14, tier:"T25", city:"St. Louis", state:"MO",  median_lsat:175,p25_lsat:165,p75_lsat:176,median_gpa:3.96,p25_gpa:3.58,p75_gpa:4.00, tuition:79800, pct_grant:82, pct_half:60, pct_full:30, med_grant:52000, p25_grant:22000, p75_grant:77000, class_size:261,  yield:0.28, seats_pct:0.07, accept_rate:0.1896, wl_rate:0.09 },
  { name:"Notre Dame Law School",              usNews:19, tier:"T25", city:"Notre Dame", state:"IN",  median_lsat:170,p25_lsat:164,p75_lsat:170,median_gpa:3.89,p25_gpa:3.73,p75_gpa:3.92, tuition:70000, pct_grant:76, pct_half:46, pct_full:20, med_grant:35000, p25_grant:8000,  p75_grant:62000, class_size:186,  yield:0.30, seats_pct:0.10, accept_rate:0.158,  wl_rate:0.11 },
  { name:"Emory University School of Law",     usNews:22, tier:"T25", city:"Atlanta", state:"GA",  median_lsat:166,p25_lsat:162,p75_lsat:167,median_gpa:3.82,p25_gpa:3.68,p75_gpa:3.87, tuition:75200, pct_grant:80, pct_half:54, pct_full:24, med_grant:42000, p25_grant:14000, p75_grant:70000, class_size:391,  yield:0.30, seats_pct:0.05, accept_rate:0.215,  wl_rate:0.11 },
  { name:"USC Gould School of Law",            usNews:18, tier:"T25", city:"Los Angeles", state:"CA",  median_lsat:169,p25_lsat:165,p75_lsat:170,median_gpa:3.91,p25_gpa:3.73,p75_gpa:3.97, tuition:72000, pct_grant:68, pct_half:38, pct_full:15, med_grant:28000, p25_grant:5000,  p75_grant:58000, class_size:227,  yield:0.26, seats_pct:0.07, accept_rate:0.112,  wl_rate:0.09 },
  { name:"UC Irvine School of Law",            usNews:27, tier:"T25", city:"Irvine", state:"CA",  median_lsat:169,p25_lsat:166,p75_lsat:170,median_gpa:3.80,p25_gpa:3.59,p75_gpa:3.90, tuition:53000, pct_grant:70, pct_half:40, pct_full:16, med_grant:26000, p25_grant:5000,  p75_grant:55000, class_size:189,  yield:0.34, seats_pct:0.08, accept_rate:0.149,  wl_rate:0.10 },

  // ─── T50 ──────────────────────────────────────────────────────────────────
  { name:"University of Florida (Levin)",      usNews:24, tier:"T50", city:"Gainesville", state:"FL",  median_lsat:169,p25_lsat:164,p75_lsat:170,median_gpa:3.91,p25_gpa:3.67,p75_gpa:3.96, tuition:36148, pct_grant:72, pct_half:44, pct_full:18, med_grant:24000, p25_grant:0,     p75_grant:50000, class_size:229,  yield:0.36, seats_pct:0.09, accept_rate:0.165,  wl_rate:0.09 },
  { name:"George Mason (Scalia) Law",          usNews:31, tier:"T50", city:"Arlington", state:"VA",  median_lsat:169,p25_lsat:162,p75_lsat:171,median_gpa:3.93,p25_gpa:3.55,p75_gpa:3.98, tuition:42000, pct_grant:98, pct_half:60, pct_full:25, med_grant:30000, p25_grant:8000,  p75_grant:42000, class_size:159,  yield:0.36, seats_pct:0.12, accept_rate:0.159,  wl_rate:0.10 },
  { name:"University of North Carolina Law",   usNews:27, tier:"T50", city:"Chapel Hill", state:"NC",  median_lsat:169,p25_lsat:165,p75_lsat:171,median_gpa:3.90,p25_gpa:3.69,p75_gpa:3.97, tuition:43000, pct_grant:65, pct_half:36, pct_full:14, med_grant:18000, p25_grant:0,     p75_grant:40000, class_size:249,  yield:0.39, seats_pct:0.08, accept_rate:0.130,  wl_rate:0.10 },
  { name:"George Washington Law",              usNews:26, tier:"T50", city:"Washington", state:"DC",  median_lsat:168,p25_lsat:163,p75_lsat:170,median_gpa:3.86,p25_gpa:3.60,p75_gpa:3.93, tuition:77526, pct_grant:60, pct_half:30, pct_full:11, med_grant:20000, p25_grant:0,     p75_grant:45000, class_size:612,  yield:0.32, seats_pct:0.05, accept_rate:0.230,  wl_rate:0.10 },
  { name:"Boston University School of Law",    usNews:25, tier:"T50", city:"Boston", state:"MA",  median_lsat:170,p25_lsat:164,p75_lsat:171,median_gpa:3.88,p25_gpa:3.71,p75_gpa:3.93, tuition:72000, pct_grant:74, pct_half:46, pct_full:19, med_grant:32000, p25_grant:8000,  p75_grant:60000, class_size:239,  yield:0.28, seats_pct:0.10, accept_rate:0.240,  wl_rate:0.10 },
  { name:"Ohio State (Moritz) Law",            usNews:28, tier:"T50", city:"Columbus", state:"OH",  median_lsat:168,p25_lsat:163,p75_lsat:169,median_gpa:3.91,p25_gpa:3.64,p75_gpa:3.97, tuition:50902, pct_grant:70, pct_half:42, pct_full:17, med_grant:20000, p25_grant:0,     p75_grant:45000, class_size:159,  yield:0.28, seats_pct:0.12, accept_rate:0.294,  wl_rate:0.10 },
  { name:"University of Alabama Law",          usNews:31, tier:"T50", city:"Tuscaloosa", state:"AL",  median_lsat:167,p25_lsat:161,p75_lsat:168,median_gpa:3.97,p25_gpa:3.76,p75_gpa:4.05, tuition:28000, pct_grant:80, pct_half:54, pct_full:24, med_grant:28000, p25_grant:6000,  p75_grant:52000, class_size:140,  yield:0.31, seats_pct:0.14, accept_rate:0.266,  wl_rate:0.10 },
  { name:"University of Georgia Law",          usNews:31, tier:"T50", city:"Athens", state:"GA",  median_lsat:168,p25_lsat:163,p75_lsat:170,median_gpa:3.94,p25_gpa:3.74,p75_gpa:4.00, tuition:36000, pct_grant:68, pct_half:38, pct_full:15, med_grant:18000, p25_grant:0,     p75_grant:40000, class_size:202,  yield:0.40, seats_pct:0.10, accept_rate:0.120,  wl_rate:0.09 },
  { name:"SMU Dedman School of Law",           usNews:43, tier:"T50", city:"Dallas", state:"TX",  median_lsat:167,p25_lsat:163,p75_lsat:169,median_gpa:3.82,p25_gpa:3.58,p75_gpa:3.93, tuition:67000, pct_grant:78, pct_half:50, pct_full:22, med_grant:30000, p25_grant:8000,  p75_grant:55000, class_size:207,  yield:0.28, seats_pct:0.11, accept_rate:0.205,  wl_rate:0.10 },
  { name:"Washington and Lee Law",             usNews:28, tier:"T50", city:"Lexington", state:"VA",  median_lsat:167,p25_lsat:163,p75_lsat:170,median_gpa:3.91,p25_gpa:3.71,p75_gpa:3.98, tuition:68000, pct_grant:80, pct_half:54, pct_full:24, med_grant:35000, p25_grant:10000, p75_grant:60000, class_size:118,  yield:0.33, seats_pct:0.15, accept_rate:0.200,  wl_rate:0.09 },
  { name:"Wake Forest Law",                    usNews:42, tier:"T50", city:"Winston-Salem", state:"NC",  median_lsat:166,p25_lsat:163,p75_lsat:168,median_gpa:3.79,p25_gpa:3.60,p75_gpa:3.90, tuition:60000, pct_grant:76, pct_half:48, pct_full:20, med_grant:28000, p25_grant:6000,  p75_grant:52000, class_size:204,  yield:0.28, seats_pct:0.12, accept_rate:0.246,  wl_rate:0.10 },
  { name:"University of Wisconsin Law",        usNews:38, tier:"T50", city:"Madison", state:"WI",  median_lsat:167,p25_lsat:162,p75_lsat:170,median_gpa:3.85,p25_gpa:3.63,p75_gpa:3.96, tuition:42000, pct_grant:65, pct_half:36, pct_full:14, med_grant:16000, p25_grant:0,     p75_grant:36000, class_size:188,  yield:0.40, seats_pct:0.10, accept_rate:0.155,  wl_rate:0.09 },
  { name:"University of Illinois Law",         usNews:38, tier:"T50", city:"Champaign", state:"IL",  median_lsat:166,p25_lsat:162,p75_lsat:170,median_gpa:3.82,p25_gpa:3.61,p75_gpa:3.95, tuition:52000, pct_grant:72, pct_half:44, pct_full:18, med_grant:22000, p25_grant:4000,  p75_grant:48000, class_size:143,  yield:0.30, seats_pct:0.12, accept_rate:0.220,  wl_rate:0.10 },
  { name:"Fordham University School of Law",   usNews:38, tier:"T50", city:"New York", state:"NY",  median_lsat:168,p25_lsat:166,p75_lsat:170,median_gpa:3.79,p25_gpa:3.64,p75_gpa:3.88, tuition:79248, pct_grant:72, pct_half:44, pct_full:18, med_grant:30000, p25_grant:8000,  p75_grant:56000, class_size:447,  yield:0.31, seats_pct:0.05, accept_rate:0.162,  wl_rate:0.10 },
  { name:"University of Utah (SJ Quinney)",    usNews:38, tier:"T50", city:"Salt Lake City", state:"UT",  median_lsat:166,p25_lsat:162,p75_lsat:170,median_gpa:3.83,p25_gpa:3.60,p75_gpa:3.96, tuition:32000, pct_grant:70, pct_half:42, pct_full:17, med_grant:18000, p25_grant:0,     p75_grant:38000, class_size:115,  yield:0.38, seats_pct:0.15, accept_rate:0.215,  wl_rate:0.09 },
  { name:"UC Davis School of Law",             usNews:50, tier:"T50", city:"Davis", state:"CA",  median_lsat:165,p25_lsat:160,p75_lsat:167,median_gpa:3.70,p25_gpa:3.49,p75_gpa:3.87, tuition:50000, pct_grant:62, pct_half:34, pct_full:13, med_grant:18000, p25_grant:0,     p75_grant:40000, class_size:209,  yield:0.33, seats_pct:0.10, accept_rate:0.160,  wl_rate:0.10 },
  { name:"University of Washington Law",       usNews:50, tier:"T50", city:"Seattle", state:"WA",  median_lsat:165,p25_lsat:162,p75_lsat:167,median_gpa:3.76,p25_gpa:3.60,p75_gpa:3.86, tuition:40000, pct_grant:64, pct_half:36, pct_full:14, med_grant:16000, p25_grant:0,     p75_grant:36000, class_size:207,  yield:0.31, seats_pct:0.10, accept_rate:0.196,  wl_rate:0.10 },
  { name:"University of Minnesota Law",        usNews:21, tier:"T50", city:"Minneapolis", state:"MN",  median_lsat:171,p25_lsat:166,p75_lsat:173,median_gpa:3.88,p25_gpa:3.61,p75_gpa:3.95, tuition:55000, pct_grant:68, pct_half:40, pct_full:16, med_grant:22000, p25_grant:0,     p75_grant:48000, class_size:228,  yield:0.30, seats_pct:0.09, accept_rate:0.220,  wl_rate:0.10 },
  { name:"University of Colorado Law",         usNews:43, tier:"T50", city:"Boulder", state:"CO",  median_lsat:164,p25_lsat:161,p75_lsat:167,median_gpa:3.81,p25_gpa:3.61,p75_gpa:3.91, tuition:40000, pct_grant:65, pct_half:36, pct_full:14, med_grant:16000, p25_grant:0,     p75_grant:36000, class_size:199,  yield:0.32, seats_pct:0.10, accept_rate:0.270,  wl_rate:0.10 },
  { name:"Tulane University Law",              usNews:50, tier:"T50", city:"New Orleans", state:"LA",  median_lsat:164,p25_lsat:160,p75_lsat:167,median_gpa:3.74,p25_gpa:3.50,p75_gpa:3.91, tuition:60000, pct_grant:78, pct_half:50, pct_full:22, med_grant:32000, p25_grant:8000,  p75_grant:58000, class_size:241,  yield:0.29, seats_pct:0.07, accept_rate:0.280,  wl_rate:0.10 },
  { name:"William & Mary Law School",          usNews:38, tier:"T50", city:"Williamsburg", state:"VA",  median_lsat:166,p25_lsat:161,p75_lsat:167,median_gpa:3.82,p25_gpa:3.53,p75_gpa:3.94, tuition:48000, pct_grant:70, pct_half:42, pct_full:17, med_grant:20000, p25_grant:2000,  p75_grant:42000, class_size:184,  yield:0.38, seats_pct:0.12, accept_rate:0.220,  wl_rate:0.10 },
  { name:"Brigham Young (Clark) Law",          usNews:38, tier:"T50", city:"Provo", state:"UT",  median_lsat:166,p25_lsat:162,p75_lsat:168,median_gpa:3.89,p25_gpa:3.71,p75_gpa:3.98, tuition:16000, pct_grant:55, pct_half:28, pct_full:10, med_grant:10000, p25_grant:0,     p75_grant:22000, class_size:128,  yield:0.48, seats_pct:0.18, accept_rate:0.280,  wl_rate:0.09 },
  { name:"Indiana University (Maurer) Law",    usNews:28, tier:"T50", city:"Bloomington", state:"IN",  median_lsat:161,p25_lsat:157,p75_lsat:164,median_gpa:3.77,p25_gpa:3.54,p75_gpa:3.92, tuition:42000, pct_grant:72, pct_half:44, pct_full:18, med_grant:20000, p25_grant:2000,  p75_grant:42000, class_size:170,  yield:0.30, seats_pct:0.13, accept_rate:0.290,  wl_rate:0.10 },
  { name:"University of Iowa Law",             usNews:28, tier:"T50", city:"Iowa City", state:"IA",  median_lsat:162,p25_lsat:158,p75_lsat:165,median_gpa:3.74,p25_gpa:3.52,p75_gpa:3.90, tuition:30000, pct_grant:65, pct_half:36, pct_full:14, med_grant:16000, p25_grant:0,     p75_grant:34000, class_size:136,  yield:0.32, seats_pct:0.13, accept_rate:0.280,  wl_rate:0.10 },

  // ─── T100 ─────────────────────────────────────────────────────────────────
  { name:"Arizona State (O'Connor) Law",       usNews:27, tier:"T100", city:"Tempe", state:"AZ", median_lsat:165,p25_lsat:161,p75_lsat:168,median_gpa:3.91,p25_gpa:3.62,p75_gpa:4.00, tuition:42000, pct_grant:68, pct_half:40, pct_full:16, med_grant:18000, p25_grant:0,     p75_grant:38000, class_size:251,  yield:0.28, seats_pct:0.10, accept_rate:0.310,  wl_rate:0.09 },
  { name:"Pepperdine Caruso Law",              usNews:47, tier:"T100", city:"Malibu", state:"CA", median_lsat:164,p25_lsat:161,p75_lsat:167,median_gpa:3.85,p25_gpa:3.62,p75_gpa:3.93, tuition:67000, pct_grant:78, pct_half:50, pct_full:22, med_grant:30000, p25_grant:8000,  p75_grant:55000, class_size:230,  yield:0.24, seats_pct:0.08, accept_rate:0.234,  wl_rate:0.10 },
  { name:"Florida State University Law",       usNews:48, tier:"T100", city:"Tallahassee", state:"FL", median_lsat:165,p25_lsat:161,p75_lsat:167,median_gpa:3.91,p25_gpa:3.69,p75_gpa:3.97, tuition:32000, pct_grant:68, pct_half:40, pct_full:16, med_grant:16000, p25_grant:0,     p75_grant:35000, class_size:153,  yield:0.35, seats_pct:0.12, accept_rate:0.160,  wl_rate:0.09 },
  { name:"Cardozo School of Law",              usNews:53, tier:"T100", city:"New York", state:"NY", median_lsat:165,p25_lsat:162,p75_lsat:167,median_gpa:3.78,p25_gpa:3.56,p75_gpa:3.87, tuition:67000, pct_grant:75, pct_half:44, pct_full:18, med_grant:28000, p25_grant:8000,  p75_grant:55000, class_size:326,  yield:0.25, seats_pct:0.12, accept_rate:0.296,  wl_rate:0.11 },
  { name:"St. John's University Law",          usNews:63, tier:"T100", city:"Queens", state:"NY", median_lsat:164,p25_lsat:156,p75_lsat:166,median_gpa:3.81,p25_gpa:3.44,p75_gpa:3.91, tuition:62000, pct_grant:78, pct_half:48, pct_full:20, med_grant:28000, p25_grant:8000,  p75_grant:54000, class_size:241,  yield:0.24, seats_pct:0.10, accept_rate:0.2305, wl_rate:0.12 },
  { name:"University of Arizona Law",          usNews:47, tier:"T100", city:"Tucson", state:"AZ", median_lsat:164,p25_lsat:159,p75_lsat:167,median_gpa:3.78,p25_gpa:3.52,p75_gpa:3.92, tuition:34000, pct_grant:68, pct_half:40, pct_full:16, med_grant:16000, p25_grant:0,     p75_grant:36000, class_size:145,  yield:0.38, seats_pct:0.13, accept_rate:0.230,  wl_rate:0.10 },
  { name:"University of Richmond Law",         usNews:50, tier:"T100", city:"Richmond", state:"VA", median_lsat:163,p25_lsat:159,p75_lsat:166,median_gpa:3.76,p25_gpa:3.53,p75_gpa:3.89, tuition:52000, pct_grant:80, pct_half:54, pct_full:22, med_grant:26000, p25_grant:8000,  p75_grant:50000, class_size:139,  yield:0.28, seats_pct:0.14, accept_rate:0.250,  wl_rate:0.10 },
  { name:"Temple Beasley School of Law",       usNews:55, tier:"T100", city:"Philadelphia", state:"PA", median_lsat:161,p25_lsat:157,p75_lsat:164,median_gpa:3.67,p25_gpa:3.40,p75_gpa:3.84, tuition:42000, pct_grant:70, pct_half:42, pct_full:17, med_grant:18000, p25_grant:2000,  p75_grant:38000, class_size:259,  yield:0.28, seats_pct:0.08, accept_rate:0.340,  wl_rate:0.10 },
  { name:"Seton Hall Law School",              usNews:71, tier:"T100", city:"Newark", state:"NJ", median_lsat:161,p25_lsat:158,p75_lsat:164,median_gpa:3.71,p25_gpa:3.51,p75_gpa:3.86, tuition:60000, pct_grant:76, pct_half:46, pct_full:18, med_grant:26000, p25_grant:6000,  p75_grant:52000, class_size:302,  yield:0.24, seats_pct:0.04, accept_rate:0.343,  wl_rate:0.11 },
  { name:"Loyola Chicago School of Law",       usNews:79, tier:"T100", city:"Chicago", state:"IL", median_lsat:161,p25_lsat:159,p75_lsat:163,median_gpa:3.70,p25_gpa:3.55,p75_gpa:3.83, tuition:57000, pct_grant:78, pct_half:48, pct_full:20, med_grant:28000, p25_grant:8000,  p75_grant:55000, class_size:296,  yield:0.26, seats_pct:0.31, accept_rate:0.282,  wl_rate:0.11 },
  { name:"Brooklyn Law School",                usNews:117,tier:"T100", city:"Brooklyn", state:"NY", median_lsat:161,p25_lsat:158,p75_lsat:163,median_gpa:3.59,p25_gpa:3.37,p75_gpa:3.75, tuition:65000, pct_grant:80, pct_half:50, pct_full:22, med_grant:32000, p25_grant:8000,  p75_grant:58000, class_size:414,  yield:0.20, seats_pct:0.15, accept_rate:0.543,  wl_rate:0.10 },
  { name:"University of Connecticut Law",      usNews:63, tier:"T100", city:"Hartford", state:"CT", median_lsat:161,p25_lsat:157,p75_lsat:164,median_gpa:3.73,p25_gpa:3.52,p75_gpa:3.89, tuition:36000, pct_grant:65, pct_half:36, pct_full:14, med_grant:14000, p25_grant:0,     p75_grant:30000, class_size:133,  yield:0.35, seats_pct:0.12, accept_rate:0.190,  wl_rate:0.10 },
  { name:"University of Maryland (Carey) Law", usNews:50, tier:"T100", city:"Baltimore", state:"MD", median_lsat:162,p25_lsat:158,p75_lsat:165,median_gpa:3.73,p25_gpa:3.54,p75_gpa:3.90, tuition:38000, pct_grant:65, pct_half:36, pct_full:14, med_grant:14000, p25_grant:0,     p75_grant:30000, class_size:213,  yield:0.32, seats_pct:0.10, accept_rate:0.250,  wl_rate:0.10 },
  { name:"University of Houston Law",          usNews:55, tier:"T100", city:"Houston", state:"TX", median_lsat:163,p25_lsat:159,p75_lsat:165,median_gpa:3.74,p25_gpa:3.52,p75_gpa:3.92, tuition:36000, pct_grant:64, pct_half:35, pct_full:13, med_grant:16000, p25_grant:0,     p75_grant:34000, class_size:239,  yield:0.38, seats_pct:0.10, accept_rate:0.168,  wl_rate:0.10 },
  { name:"Villanova University Law",           usNews:63, tier:"T100", city:"Villanova", state:"PA", median_lsat:161,p25_lsat:157,p75_lsat:163,median_gpa:3.70,p25_gpa:3.49,p75_gpa:3.85, tuition:56000, pct_grant:74, pct_half:46, pct_full:19, med_grant:24000, p25_grant:4000,  p75_grant:46000, class_size:201,  yield:0.27, seats_pct:0.10, accept_rate:0.310,  wl_rate:0.10 },
  { name:"University of Miami Law",            usNews:82, tier:"T100", city:"Coral Gables", state:"FL", median_lsat:163,p25_lsat:159,p75_lsat:165,median_gpa:3.76,p25_gpa:3.52,p75_gpa:3.90, tuition:60000, pct_grant:72, pct_half:44, pct_full:18, med_grant:24000, p25_grant:4000,  p75_grant:46000, class_size:354,  yield:0.29, seats_pct:0.08, accept_rate:0.290,  wl_rate:0.10 },
  { name:"Loyola (LA) Law School",             usNews:71, tier:"T100", city:"Los Angeles", state:"CA", median_lsat:163,p25_lsat:160,p75_lsat:165,median_gpa:3.74,p25_gpa:3.52,p75_gpa:3.89, tuition:58000, pct_grant:74, pct_half:46, pct_full:19, med_grant:26000, p25_grant:6000,  p75_grant:50000, class_size:338,  yield:0.28, seats_pct:0.08, accept_rate:0.306,  wl_rate:0.10 },
  { name:"University of Kentucky Law",         usNews:55, tier:"T100", city:"Lexington", state:"KY", median_lsat:161,p25_lsat:156,p75_lsat:164,median_gpa:3.71,p25_gpa:3.47,p75_gpa:3.86, tuition:26000, pct_grant:65, pct_half:36, pct_full:14, med_grant:14000, p25_grant:0,     p75_grant:30000, class_size:133,  yield:0.36, seats_pct:0.14, accept_rate:0.300,  wl_rate:0.10 },
  { name:"Case Western Reserve Law",           usNews:76, tier:"T100", city:"Cleveland", state:"OH", median_lsat:161,p25_lsat:157,p75_lsat:164,median_gpa:3.70,p25_gpa:3.46,p75_gpa:3.87, tuition:58000, pct_grant:80, pct_half:52, pct_full:22, med_grant:30000, p25_grant:8000,  p75_grant:55000, class_size:154,  yield:0.26, seats_pct:0.12, accept_rate:0.350,  wl_rate:0.10 },
  { name:"Northeastern University Law",        usNews:63, tier:"T100", city:"Boston", state:"MA", median_lsat:161,p25_lsat:157,p75_lsat:163,median_gpa:3.70,p25_gpa:3.48,p75_gpa:3.86, tuition:60000, pct_grant:72, pct_half:44, pct_full:18, med_grant:24000, p25_grant:4000,  p75_grant:46000, class_size:181,  yield:0.27, seats_pct:0.12, accept_rate:0.310,  wl_rate:0.10 },
  { name:"University of Denver (Sturm) Law",   usNews:76, tier:"T100", city:"Denver", state:"CO", median_lsat:161,p25_lsat:157,p75_lsat:164,median_gpa:3.72,p25_gpa:3.48,p75_gpa:3.88, tuition:57000, pct_grant:76, pct_half:48, pct_full:20, med_grant:26000, p25_grant:6000,  p75_grant:50000, class_size:202,  yield:0.27, seats_pct:0.10, accept_rate:0.340,  wl_rate:0.10 },
  { name:"Florida International University Law",usNews:68,tier:"T100", city:"Miami", state:"FL", median_lsat:160,p25_lsat:157,p75_lsat:163,median_gpa:3.72,p25_gpa:3.48,p75_gpa:3.88, tuition:24000, pct_grant:62, pct_half:34, pct_full:13, med_grant:12000, p25_grant:0,     p75_grant:26000, class_size:162,  yield:0.34, seats_pct:0.14, accept_rate:0.215,  wl_rate:0.10 },
  { name:"University of San Diego Law",        usNews:83, tier:"T100", city:"San Diego", state:"CA", median_lsat:163,p25_lsat:159,p75_lsat:165,median_gpa:3.72,p25_gpa:3.50,p75_gpa:3.87, tuition:60000, pct_grant:76, pct_half:48, pct_full:20, med_grant:26000, p25_grant:6000,  p75_grant:50000, class_size:222,  yield:0.26, seats_pct:0.09, accept_rate:0.280,  wl_rate:0.10 },
  { name:"Penn State (Dickinson) Law",         usNews:76, tier:"T100", city:"University Park", state:"PA", median_lsat:160,p25_lsat:156,p75_lsat:163,median_gpa:3.68,p25_gpa:3.44,p75_gpa:3.85, tuition:50000, pct_grant:74, pct_half:46, pct_full:19, med_grant:22000, p25_grant:4000,  p75_grant:44000, class_size:161,  yield:0.27, seats_pct:0.12, accept_rate:0.350,  wl_rate:0.10 },
  { name:"Rutgers Law School",                 usNews:76, tier:"T100", city:"Newark", state:"NJ", median_lsat:160,p25_lsat:156,p75_lsat:163,median_gpa:3.67,p25_gpa:3.44,p75_gpa:3.84, tuition:34000, pct_grant:62, pct_half:34, pct_full:13, med_grant:12000, p25_grant:0,     p75_grant:26000, class_size:278,  yield:0.30, seats_pct:0.10, accept_rate:0.320,  wl_rate:0.10 },
  { name:"University of Tennessee Law",        usNews:63, tier:"T100", city:"Knoxville", state:"TN", median_lsat:161,p25_lsat:157,p75_lsat:165,median_gpa:3.72,p25_gpa:3.49,p75_gpa:3.87, tuition:26000, pct_grant:65, pct_half:36, pct_full:14, med_grant:14000, p25_grant:0,     p75_grant:30000, class_size:128,  yield:0.34, seats_pct:0.14, accept_rate:0.310,  wl_rate:0.10 },
  { name:"UC Hastings (College of the Law)",   usNews:68, tier:"T100", city:"San Francisco", state:"CA", median_lsat:161,p25_lsat:157,p75_lsat:164,median_gpa:3.69,p25_gpa:3.46,p75_gpa:3.86, tuition:47000, pct_grant:62, pct_half:34, pct_full:13, med_grant:16000, p25_grant:0,     p75_grant:34000, class_size:291,  yield:0.28, seats_pct:0.10, accept_rate:0.310,  wl_rate:0.10 },
  { name:"University of Pittsburgh Law",       usNews:76, tier:"T100", city:"Pittsburgh", state:"PA", median_lsat:160,p25_lsat:157,p75_lsat:163,median_gpa:3.70,p25_gpa:3.48,p75_gpa:3.85, tuition:46000, pct_grant:70, pct_half:42, pct_full:17, med_grant:18000, p25_grant:2000,  p75_grant:38000, class_size:152,  yield:0.28, seats_pct:0.12, accept_rate:0.340,  wl_rate:0.10 },
  { name:"Lewis & Clark Law School",           usNews:93, tier:"T100", city:"Portland", state:"OR", median_lsat:161,p25_lsat:157,p75_lsat:163,median_gpa:3.63,p25_gpa:3.40,p75_gpa:3.82, tuition:52000, pct_grant:78, pct_half:50, pct_full:22, med_grant:26000, p25_grant:6000,  p75_grant:50000, class_size:189,  yield:0.24, seats_pct:0.10, accept_rate:0.360,  wl_rate:0.10 },
  { name:"University of Missouri Law",         usNews:76, tier:"T100", city:"Columbia", state:"MO", median_lsat:160,p25_lsat:156,p75_lsat:164,median_gpa:3.67,p25_gpa:3.42,p75_gpa:3.84, tuition:24000, pct_grant:65, pct_half:36, pct_full:14, med_grant:12000, p25_grant:0,     p75_grant:26000, class_size:135,  yield:0.35, seats_pct:0.14, accept_rate:0.340,  wl_rate:0.10 },
  { name:"University of Nebraska Law",         usNews:76, tier:"T100", city:"Lincoln", state:"NE", median_lsat:160,p25_lsat:156,p75_lsat:163,median_gpa:3.69,p25_gpa:3.44,p75_gpa:3.85, tuition:22000, pct_grant:65, pct_half:36, pct_full:14, med_grant:10000, p25_grant:0,     p75_grant:22000, class_size:116,  yield:0.38, seats_pct:0.15, accept_rate:0.340,  wl_rate:0.10 },
  { name:"University of Oklahoma Law",         usNews:76, tier:"T100", city:"Norman", state:"OK", median_lsat:160,p25_lsat:156,p75_lsat:163,median_gpa:3.68,p25_gpa:3.44,p75_gpa:3.84, tuition:22000, pct_grant:65, pct_half:36, pct_full:14, med_grant:12000, p25_grant:0,     p75_grant:26000, class_size:134,  yield:0.36, seats_pct:0.14, accept_rate:0.360,  wl_rate:0.10 },
  { name:"Drexel (Kline) Law School",          usNews:93, tier:"T100", city:"Philadelphia", state:"PA", median_lsat:160,p25_lsat:156,p75_lsat:163,median_gpa:3.65,p25_gpa:3.42,p75_gpa:3.82, tuition:52000, pct_grant:76, pct_half:48, pct_full:20, med_grant:24000, p25_grant:4000,  p75_grant:46000, class_size:178,  yield:0.25, seats_pct:0.10, accept_rate:0.360,  wl_rate:0.10 },
  { name:"UNLV (Boyd) Law School",             usNews:76, tier:"T100", city:"Las Vegas", state:"NV", median_lsat:160,p25_lsat:156,p75_lsat:163,median_gpa:3.68,p25_gpa:3.44,p75_gpa:3.85, tuition:24000, pct_grant:62, pct_half:34, pct_full:13, med_grant:10000, p25_grant:0,     p75_grant:22000, class_size:128,  yield:0.35, seats_pct:0.14, accept_rate:0.310,  wl_rate:0.10 },
  { name:"University of South Carolina Law",   usNews:76, tier:"T100", city:"Columbia", state:"SC", median_lsat:161,p25_lsat:157,p75_lsat:163,median_gpa:3.68,p25_gpa:3.46,p75_gpa:3.85, tuition:26000, pct_grant:65, pct_half:36, pct_full:14, med_grant:12000, p25_grant:0,     p75_grant:26000, class_size:177,  yield:0.37, seats_pct:0.14, accept_rate:0.340,  wl_rate:0.10 },
  { name:"Catholic University Law (CUA)",      usNews:93, tier:"T100", city:"Washington", state:"DC", median_lsat:159,p25_lsat:155,p75_lsat:163,median_gpa:3.63,p25_gpa:3.38,p75_gpa:3.81, tuition:56000, pct_grant:74, pct_half:46, pct_full:19, med_grant:22000, p25_grant:4000,  p75_grant:44000, class_size:165,  yield:0.26, seats_pct:0.12, accept_rate:0.390,  wl_rate:0.10 },
  { name:"Wayne State University Law",         usNews:93, tier:"T100", city:"Detroit", state:"MI", median_lsat:158,p25_lsat:154,p75_lsat:162,median_gpa:3.59,p25_gpa:3.34,p75_gpa:3.78, tuition:30000, pct_grant:65, pct_half:36, pct_full:14, med_grant:12000, p25_grant:0,     p75_grant:26000, class_size:133,  yield:0.30, seats_pct:0.14, accept_rate:0.380,  wl_rate:0.10 },
  { name:"University of Oregon Law",           usNews:93, tier:"T100", city:"Eugene", state:"OR", median_lsat:160,p25_lsat:155,p75_lsat:163,median_gpa:3.64,p25_gpa:3.40,p75_gpa:3.82, tuition:38000, pct_grant:65, pct_half:36, pct_full:14, med_grant:14000, p25_grant:0,     p75_grant:30000, class_size:172,  yield:0.30, seats_pct:0.12, accept_rate:0.370,  wl_rate:0.10 },
  { name:"Howard University Law",              usNews:68, tier:"T100", city:"Washington", state:"DC", median_lsat:156,p25_lsat:152,p75_lsat:160,median_gpa:3.63,p25_gpa:3.38,p75_gpa:3.82, tuition:40000, pct_grant:70, pct_half:42, pct_full:17, med_grant:18000, p25_grant:2000,  p75_grant:38000, class_size:145,  yield:0.34, seats_pct:0.15, accept_rate:0.290,  wl_rate:0.10 },
  { name:"Baylor Law School",                  usNews:55, tier:"T100", city:"Waco", state:"TX", median_lsat:163,p25_lsat:159,p75_lsat:166,median_gpa:3.74,p25_gpa:3.51,p75_gpa:3.91, tuition:58000, pct_grant:74, pct_half:46, pct_full:19, med_grant:22000, p25_grant:4000,  p75_grant:44000, class_size:143,  yield:0.34, seats_pct:0.13, accept_rate:0.300,  wl_rate:0.10 },
  { name:"Marquette University Law",           usNews:83, tier:"T100", city:"Milwaukee", state:"WI", median_lsat:158,p25_lsat:154,p75_lsat:162,median_gpa:3.63,p25_gpa:3.38,p75_gpa:3.81, tuition:52000, pct_grant:76, pct_half:48, pct_full:20, med_grant:22000, p25_grant:4000,  p75_grant:44000, class_size:155,  yield:0.28, seats_pct:0.12, accept_rate:0.420,  wl_rate:0.10 },
  { name:"Gonzaga University Law",             usNews:93, tier:"T100", city:"Spokane", state:"WA", median_lsat:157,p25_lsat:153,p75_lsat:161,median_gpa:3.62,p25_gpa:3.38,p75_gpa:3.80, tuition:48000, pct_grant:76, pct_half:48, pct_full:20, med_grant:20000, p25_grant:4000,  p75_grant:40000, class_size:130,  yield:0.30, seats_pct:0.13, accept_rate:0.450,  wl_rate:0.10 },
  { name:"Hofstra (Deane) Law School",         usNews:93, tier:"T100", city:"Hempstead", state:"NY", median_lsat:159,p25_lsat:155,p75_lsat:162,median_gpa:3.65,p25_gpa:3.40,p75_gpa:3.83, tuition:62000, pct_grant:76, pct_half:48, pct_full:20, med_grant:24000, p25_grant:4000,  p75_grant:46000, class_size:182,  yield:0.26, seats_pct:0.12, accept_rate:0.380,  wl_rate:0.10 },
  { name:"University of Louisville Law",       usNews:93, tier:"T100", city:"Louisville", state:"KY", median_lsat:157,p25_lsat:153,p75_lsat:161,median_gpa:3.63,p25_gpa:3.38,p75_gpa:3.82, tuition:25000, pct_grant:68, pct_half:40, pct_full:16, med_grant:14000, p25_grant:0,     p75_grant:28000, class_size:120,  yield:0.36, seats_pct:0.14, accept_rate:0.420,  wl_rate:0.10 },
  { name:"West Virginia University Law",       usNews:93, tier:"T100", city:"Morgantown", state:"WV", median_lsat:157,p25_lsat:153,p75_lsat:161,median_gpa:3.64,p25_gpa:3.40,p75_gpa:3.82, tuition:22000, pct_grant:66, pct_half:38, pct_full:15, med_grant:12000, p25_grant:0,     p75_grant:24000, class_size:115,  yield:0.36, seats_pct:0.15, accept_rate:0.440,  wl_rate:0.10 },
  { name:"Suffolk University Law",             usNews:93, tier:"T100", city:"Boston", state:"MA", median_lsat:158,p25_lsat:154,p75_lsat:162,median_gpa:3.59,p25_gpa:3.34,p75_gpa:3.78, tuition:56000, pct_grant:72, pct_half:44, pct_full:18, med_grant:20000, p25_grant:2000,  p75_grant:40000, class_size:210,  yield:0.25, seats_pct:0.11, accept_rate:0.450,  wl_rate:0.10 },
  { name:"St. Louis University Law",           usNews:93, tier:"T100", city:"St. Louis", state:"MO", median_lsat:158,p25_lsat:154,p75_lsat:162,median_gpa:3.64,p25_gpa:3.40,p75_gpa:3.83, tuition:50000, pct_grant:76, pct_half:48, pct_full:20, med_grant:22000, p25_grant:4000,  p75_grant:42000, class_size:150,  yield:0.28, seats_pct:0.12, accept_rate:0.400,  wl_rate:0.10 },
  { name:"University of Mississippi Law",      usNews:80, tier:"T100", city:"Oxford", state:"MS", median_lsat:158,p25_lsat:154,p75_lsat:162,median_gpa:3.68,p25_gpa:3.44,p75_gpa:3.85, tuition:20000, pct_grant:65, pct_half:36, pct_full:14, med_grant:10000, p25_grant:0,     p75_grant:22000, class_size:145,  yield:0.38, seats_pct:0.15, accept_rate:0.420,  wl_rate:0.10 },
  { name:"University of Kansas Law",           usNews:80, tier:"T100", city:"Lawrence", state:"KS", median_lsat:159,p25_lsat:155,p75_lsat:162,median_gpa:3.66,p25_gpa:3.42,p75_gpa:3.84, tuition:24000, pct_grant:65, pct_half:36, pct_full:14, med_grant:12000, p25_grant:0,     p75_grant:24000, class_size:138,  yield:0.36, seats_pct:0.14, accept_rate:0.380,  wl_rate:0.10 },
  { name:"Mercer University Law",              usNews:100,tier:"T100", city:"Macon", state:"GA", median_lsat:157,p25_lsat:153,p75_lsat:161,median_gpa:3.62,p25_gpa:3.38,p75_gpa:3.80, tuition:46000, pct_grant:76, pct_half:48, pct_full:20, med_grant:20000, p25_grant:4000,  p75_grant:38000, class_size:145,  yield:0.30, seats_pct:0.14, accept_rate:0.430,  wl_rate:0.10 },
  { name:"Quinnipiac University Law",          usNews:100,tier:"T100", city:"North Haven", state:"CT", median_lsat:158,p25_lsat:154,p75_lsat:162,median_gpa:3.62,p25_gpa:3.38,p75_gpa:3.80, tuition:58000, pct_grant:74, pct_half:46, pct_full:19, med_grant:22000, p25_grant:4000,  p75_grant:42000, class_size:168,  yield:0.27, seats_pct:0.12, accept_rate:0.410,  wl_rate:0.10 },
  { name:"Duquesne University Law",            usNews:100,tier:"T100", city:"Pittsburgh", state:"PA", median_lsat:157,p25_lsat:153,p75_lsat:161,median_gpa:3.62,p25_gpa:3.37,p75_gpa:3.81, tuition:48000, pct_grant:76, pct_half:48, pct_full:20, med_grant:20000, p25_grant:4000,  p75_grant:38000, class_size:130,  yield:0.29, seats_pct:0.13, accept_rate:0.420,  wl_rate:0.10 },
  { name:"Oklahoma City University Law",       usNews:100,tier:"T100", city:"Oklahoma City", state:"OK", median_lsat:156,p25_lsat:152,p75_lsat:160,median_gpa:3.58,p25_gpa:3.33,p75_gpa:3.78, tuition:38000, pct_grant:74, pct_half:46, pct_full:19, med_grant:18000, p25_grant:2000,  p75_grant:36000, class_size:110,  yield:0.30, seats_pct:0.15, accept_rate:0.470,  wl_rate:0.10 },
  { name:"Tulsa University Law",               usNews:100,tier:"T100", city:"Tulsa", state:"OK", median_lsat:158,p25_lsat:154,p75_lsat:162,median_gpa:3.62,p25_gpa:3.38,p75_gpa:3.80, tuition:40000, pct_grant:78, pct_half:50, pct_full:22, med_grant:20000, p25_grant:4000,  p75_grant:40000, class_size:120,  yield:0.32, seats_pct:0.14, accept_rate:0.400,  wl_rate:0.10 },
];


const TIER_META = {
  T14:  { label:"T14",    color:"#38bdf8", bg:"rgba(56,189,248,0.14)" },
  T25:  { label:"Top 25", color:"#818cf8", bg:"rgba(129,140,248,0.14)" },
  T50:  { label:"Top 50", color:"#a78bfa", bg:"rgba(167,139,250,0.11)" },
  T100: { label:"Top 100",color:"#60a5fa", bg:"rgba(96,165,250,0.11)" },
};

function getTimingLabel(d) {
  if (!d) return "early";
  const dt = new Date(d); const m = dt.getMonth()+1; const y = dt.getFullYear();
  if (y===2025) { if (m<=10) return "early"; if (m===11) return "ontime_early"; if (m===12) return "ontime"; }
  if (y===2026) { if (m===1) return "ontime_late"; if (m===2) return "late"; if (m>=3) return "very_late"; }
  return "early";
}

const TIMING_PROFILES = {
  early:       { label:"Early (Sep–Oct)",       color:"#4ade80", admPenalty:0,    scholPenalty:0,    wlShift: 0,    desc:"Optimal window — full scholarship budget, most seats open." },
  ontime_early:{ label:"On-Time (Nov)",          color:"#a3e635", admPenalty:0.08, scholPenalty:0.10, wlShift: 0.01, desc:"Strong timing. Slightly fewer top scholarship dollars than Sep-Oct." },
  ontime:      { label:"On-Time (Dec)",          color:"#facc15", admPenalty:0.15, scholPenalty:0.18, wlShift: 0.02, desc:"Acceptable for most schools, but prime scholarship funds thinning." },
  ontime_late: { label:"On-Time/Late (Jan)",     color:"#fb923c", admPenalty:0.22, scholPenalty:0.28, wlShift: 0.03, desc:"T14 scholarship budgets significantly allocated. Some schools near quota." },
  late:        { label:"Late (Feb)",             color:"#f97316", admPenalty:0.32, scholPenalty:0.42, wlShift: 0.05, desc:"Meaningfully reduced odds. Scholarship pool depleted at T14s." },
  very_late:   { label:"Very Late (Mar+)",       color:"#ef4444", admPenalty:0.42, scholPenalty:0.58, wlShift: 0.07, desc:"March+ applications face stiff headwinds. Several schools near capacity." },
};

function seatsRemaining(school, tk) {
  const drain = { early:0, ontime_early:0.04, ontime:0.08, ontime_late:0.14, late:0.22, very_late:0.34 };
  const pct = Math.max(0, school.seats_pct - (drain[tk]||0));
  return Math.max(0, Math.round(pct * (school.class_size / school.yield)));
}

function scoreApplicant(gpa, lsat, school) {
  return ((gpa - school.median_gpa)/0.12 + (lsat - school.median_lsat)/3.5) / 2;
}

function estimateOutcomes(gpa, lsat, school, urm, softs, tk) {
  const timing = TIMING_PROFILES[tk] || TIMING_PROFILES.early;
  const base = scoreApplicant(gpa, lsat, school);
  const boost = (urm ? 0.35 : 0) + (softs==="excellent" ? 0.18 : softs==="good" ? 0.07 : 0);
  const adj = base + boost;
  const isT14 = school.tier === "T14" || school.tier === "T25";
  const admPenalty = isT14 ? timing.admPenalty : timing.admPenalty * 0.35;
  const scholPenalty = timing.scholPenalty;

  const rawAccept = school.accept_rate;
  const statsMult = adj >= 1.5 ? 5.5 : adj >= 1.0 ? 4.5 : adj >= 0.5 ? 3.0 : adj >= 0.0 ? 2.0 : adj >= -0.5 ? 1.0 : adj >= -1.0 ? 0.45 : 0.18;
  let pAccept = Math.min(0.94, rawAccept * statsMult);
  pAccept = pAccept * (1 - admPenalty);

  const baseWL = school.wl_rate;
  let wlMult = adj >= 1.0 ? 0.2 : adj >= 0.3 ? 0.6 : adj >= -0.3 ? 1.4 : adj >= -0.8 ? 1.2 : 0.6;
  let pWL = Math.min(0.40, baseWL * wlMult + timing.wlShift);
  if (school.seats_pct < 0.05 && tk === "very_late") pWL = Math.min(0.45, pWL * 1.4);

  const pAcceptCapped = Math.min(pAccept, 1 - pWL);
  const pDeny = Math.max(0.02, 1 - pAcceptCapped - pWL);
  const total = pAcceptCapped + pWL + pDeny;
  const accept = Math.round((pAcceptCapped / total) * 100);
  const waitlist = Math.round((pWL / total) * 100);
  const deny = 100 - accept - waitlist;

  let scholLabel, scholColor, scholEmoji, scholLikelihood, estMin, estMax;
  const t = school.tuition;
  if (adj >= 1.4) {
    scholLabel="Full Ride"; scholColor="#34d399"; scholEmoji="🏆";
    scholLikelihood = Math.min(92, Math.round(school.pct_full * 3.2));
    estMin = t*0.85; estMax = t*1.05;
  } else if (adj >= 0.7) {
    scholLabel="Strong Merit Aid"; scholColor="#4ade80"; scholEmoji="⭐";
    scholLikelihood = Math.min(78, Math.round(school.pct_half * 1.5));
    estMin = t*0.45; estMax = t*0.85;
  } else if (adj >= 0.15) {
    scholLabel="Partial Scholarship"; scholColor="#fbbf24"; scholEmoji="🎓";
    scholLikelihood = Math.min(60, Math.round(school.pct_grant * 0.75));
    estMin = school.p25_grant; estMax = school.p75_grant;
  } else if (adj >= -0.4) {
    scholLabel="Small Aid Possible"; scholColor="#fb923c"; scholEmoji="💡";
    scholLikelihood = Math.min(35, Math.round(school.pct_grant * 0.35));
    estMin = school.p25_grant * 0.3; estMax = school.p25_grant * 1.1;
  } else {
    scholLabel="Unlikely"; scholColor="#f87171"; scholEmoji="📋";
    scholLikelihood = 8; estMin = 0; estMax = 0;
  }
  scholLikelihood = Math.max(2, Math.round(scholLikelihood * (1 - admPenalty)));
  estMin = Math.round(estMin * (1 - scholPenalty));
  estMax = Math.round(estMax * (1 - scholPenalty));

  const gpaPos = gpa >= school.p75_gpa ? "Above 75th ▲" : gpa >= school.median_gpa ? "Above Median" : gpa >= school.p25_gpa ? "Below Median" : "Below 25th ▼";
  const lsatPos = lsat >= school.p75_lsat ? "Above 75th ▲" : lsat >= school.median_lsat ? "Above Median" : lsat >= school.p25_lsat ? "Below Median" : "Below 25th ▼";

  return { accept, waitlist, deny, scholLabel, scholColor, scholEmoji, scholLikelihood, estMin, estMax, gpaPos, lsatPos, score: adj, admPenalty, scholPenalty, seats: seatsRemaining(school, tk), timing };
}

export default function App() {
  const [gpa, setGpa] = useState("");
  const [lsat, setLsat] = useState("");
  const [urm, setUrm] = useState(false);
  const [softs, setSofts] = useState("average");
  const [appDate, setAppDate] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [results, setResults] = useState([]);
  const [showDrop, setShowDrop] = useState(false);

  const [activeTab, setActiveTab] = useState("estimator");
  const [loading, setLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [recsLoading, setRecsLoading] = useState(false);
  const [recs, setRecs] = useState(null);
  const [recStateFilter, setRecStateFilter] = useState("");
  const [recTuitionMax, setRecTuitionMax] = useState("");
  const [mounted, setMounted] = useState(false);


  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  const filtered = SCHOOLS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) && !selected.find(x => x.name === s.name)
  ).slice(0, 9);

  const addSchool = s => { setSelected(p => [...p, s]); setSearch(""); setShowDrop(false); };
  const removeSchool = name => { setSelected(p => p.filter(s => s.name !== name)); setResults(p => p.filter(r => r.name !== name)); };

  const gpaNum = parseFloat(gpa);
  const lsatNum = parseInt(lsat);
  const gpaOk = gpaNum >= 2.0 && gpaNum <= 4.33;
  const lsatOk = lsatNum >= 120 && lsatNum <= 180;
  const canGo = gpaOk && lsatOk && selected.length > 0;
  const timingKey = getTimingLabel(appDate);
  const timing = TIMING_PROFILES[timingKey];

  const runEstimate = async () => {
    if (!canGo) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const res = selected.map(s => ({ ...s, ...estimateOutcomes(gpaNum, lsatNum, s, urm, softs, timingKey) }))
      .sort((a, b) => b.accept - a.accept);
    setResults(res);
    setActiveTab("results");
    setAiInsight("");
    setLoading(false);
  };

  const getAI = async () => {
    if (!results.length) return;
    setAiLoading(true);
    setAiInsight("");
    const td = appDate ? `Application date: ${appDate} (${timing.label})` : "No date provided";
    const sum = results.map(r =>
      `${r.name}: Accept ${r.accept}% / WL ${r.waitlist}% / Deny ${r.deny}% | Schol: ${r.scholLabel} ~${r.scholLikelihood}% / $${r.estMin.toLocaleString()}-$${r.estMax.toLocaleString()} | Seats: ~${r.seats}`
    ).join("\n");
    try {
      const resp = await fetch("/api/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: "You are a top law school admissions counselor. Give 3-4 sentences of sharp, actionable strategy. Reference specific schools by name. Prioritize timing urgency if relevant. No filler.",
          messages: [{ role: "user", content: `GPA:${gpa} LSAT:${lsat} URM:${urm} Softs:${softs}\n${td}\n2025-26 cycle: apps up 23% nationally. March 2026 - many T14s near class capacity.\n\n${sum}\n\nGive strategic insight covering admission positioning, waitlist strategy, and scholarship leverage.` }]
        })
      });
      if (!resp.ok) throw new Error("api");
      const d = await resp.json();
      setAiInsight(d.content?.[0]?.text || "Could not generate insight.");
    } catch(e) {
      setAiInsight("AI unavailable right now. The estimator and compare features still work fully — try AI Strategy again in a moment.");
    }
    setAiLoading(false);
  };

  const canRec = gpaOk && lsatOk;

  const getRecommendations = async () => {
    if (!canRec) return;
    setRecsLoading(true);
    setRecs(null);
    setActiveTab("recommendations");
    // Pre-score and sort schools, send only top ~40 most relevant
    let pool = SCHOOLS.map(s => ({
      ...s,
      _score: Math.abs(scoreApplicant(gpaNum, lsatNum, s))
    })).sort((a, b) => a._score - b._score);
    // If filters are active, prioritize matching schools but include others as fallback
    const stateF = recStateFilter;
    const tuitionF = recTuitionMax ? parseInt(recTuitionMax) * 1000 : 0;
    if (stateF || tuitionF) {
      const matching = pool.filter(s => {
        if (stateF && s.state !== stateF) return false;
        if (tuitionF && s.tuition > tuitionF) return false;
        return true;
      });
      const nonMatching = pool.filter(s => !matching.includes(s));
      pool = [...matching.slice(0, 30), ...nonMatching.slice(0, 10)];
    } else {
      pool = pool.slice(0, 40);
    }
    const schoolList = pool.map(s =>
      `${s.name}|${s.tier}|${s.city},${s.state}|acc${Math.round(s.accept_rate*100)}%|L${s.median_lsat}|G${s.median_gpa}|$${Math.round(s.tuition/1000)}k|grant$${Math.round(s.med_grant/1000)}k`
    ).join("\n");
    const filterNote = (stateF || tuitionF) ?
      `\nIMPORTANT FILTERS: ${stateF ? `Strongly prefer schools in ${stateF}.` : ""} ${tuitionF ? `Strongly prefer tuition under $${tuitionF.toLocaleString()}.` : ""} Prioritize schools matching these filters but include 1-2 non-matching schools per bucket if they are exceptionally strong fits.` : "";
    try {
      const resp = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: "You are an expert law school admissions counselor. You MUST respond with ONLY valid JSON. No markdown fences, no text before or after the JSON object. Keep all strings concise (under 25 words each).",
          messages: [{ role: "user", content: `Student: GPA ${gpaNum.toFixed(2)}, LSAT ${lsatNum}, URM: ${urm}, Softs: ${softs}, Timing: ${timingKey}.${filterNote}

Schools (name|tier|location|accept rate|med LSAT|med GPA|tuition|med grant):
${schoolList}

Return ONLY this JSON (no markdown, no backticks):
{"summary":"2-3 sentence overview","reach":[{"name":"exact school name","reason":"why reach","tip":"tactical tip"}],"target":[{"name":"exact school name","reason":"why target","tip":"tactical tip"}],"safety":[{"name":"exact school name","reason":"why safety","tip":"tactical tip"}]}
Pick 5 schools per bucket (15 total). Use exact school names from the list above.` }]
        })
      });
      if (!resp.ok) {
        console.error("API error:", resp.status);
        setRecs({ error: `API returned ${resp.status}. Please try again.` });
        setRecsLoading(false);
        return;
      }
      const d = await resp.json();
      const text = d.content?.[0]?.text || "";
      if (!text) {
        setRecs({ error: "Empty response from AI. Please try again." });
        setRecsLoading(false);
        return;
      }
      const clean = text.replace(/```json\s?|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setRecs(parsed);
    } catch(e) {
      console.error("Recommendations error:", e);
      setRecs({ error: "Could not generate recommendations: " + (e.message || "Unknown error") });
    }
    setRecsLoading(false);
  };

  const tabs = [
    { id:"estimator", label:"Estimator" },
    { id:"recommendations", label:"Recommendations" },
    { id:"results", label:`Results${results.length ? ` (${results.length})` : ""}` },
    { id:"compare", label:"Compare" }
  ];

  // ── TIER COLORS (warm palette) ──
  const TIER_DOT = { T14:"#e05c2a", T25:"#9b6fe0", T50:"#2a7ae0", T100:"#2aae7a" };

  const OutcomeDonut = ({ accept, waitlist, deny, size=80 }) => {
    const total = accept + waitlist + deny;
    const r2 = 27, cx2 = size/2, cy2 = size/2, sw = 9;
    const circ = 2 * Math.PI * r2;
    const aDash = (accept/total)*circ, wDash = (waitlist/total)*circ, dDash = (deny/total)*circ;
    return (
      <svg width={size} height={size} style={{transform:"rotate(-90deg)",flexShrink:0}}>
        <circle cx={cx2} cy={cy2} r={r2} fill="none" stroke="#e8e4dc" strokeWidth={sw}/>
        <circle cx={cx2} cy={cy2} r={r2} fill="none" stroke="#2d9e5f" strokeWidth={sw}
          strokeDasharray={`${aDash} ${circ}`} strokeDashoffset={0}/>
        <circle cx={cx2} cy={cy2} r={r2} fill="none" stroke="#d97c1a" strokeWidth={sw}
          strokeDasharray={`${wDash} ${circ}`} strokeDashoffset={-aDash}/>
        <circle cx={cx2} cy={cy2} r={r2} fill="none" stroke="#cc3b2a" strokeWidth={sw}
          strokeDasharray={`${dDash} ${circ}`} strokeDashoffset={-(aDash+wDash)}/>
      </svg>
    );
  };

  const StatBar = ({ pct, color, height=4 }) => (
    <div style={{height,borderRadius:height,background:"#e8e4dc",overflow:"hidden"}}>
      <div style={{height:"100%",width:`${Math.min(100,Math.max(0,pct))}%`,borderRadius:height,background:color,transition:"width 0.8s cubic-bezier(.4,0,.2,1)"}}/>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"#f0ede8",fontFamily:"'DM Sans',system-ui,sans-serif",color:"#1a1a1a"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        input,button{font-family:'DM Sans',sans-serif;}
        input:focus{outline:none;}
        input[type=date]::-webkit-calendar-picker-indicator{opacity:0.4;cursor:pointer;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:#d4cfc7;border-radius:4px;}
        .nav-link{color:#444;font-size:14px;font-weight:500;cursor:pointer;padding:6px 14px;border-radius:20px;transition:background 0.15s;}
        .nav-link:hover{background:#e8e4dc;}
        .pill-tab{transition:all 0.18s;cursor:pointer;padding:7px 18px;border-radius:20px;font-size:13px;font-weight:500;border:none;white-space:nowrap;}
        .pill-tab:hover{background:#e4e0d8!important;}
        .school-row{transition:background 0.12s;}
        .school-row:hover{background:#f5f2ed!important;}
        .result-card{transition:all 0.18s;cursor:pointer;}
        .result-card:hover{box-shadow:0 4px 24px rgba(0,0,0,0.09)!important;transform:translateY(-1px);}
        .cta-btn{transition:all 0.18s;}
        .cta-btn:hover{background:#c94d1e!important;transform:translateY(-1px);box-shadow:0 4px 18px rgba(224,92,42,0.35)!important;}
        .outline-btn{transition:all 0.18s;}
        .outline-btn:hover{background:#e8e4dc!important;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
        .fade-up{animation:fadeUp 0.4s ease forwards;}
        @keyframes spin{to{transform:rotate(360deg);}}
        .spin{animation:spin 0.8s linear infinite;display:inline-block;}
        .softs-tip-wrap:hover .softs-tip{opacity:1!important;}
        .grid-2col{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
        .grid-3col{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
        .nav-tabs{display:flex;align-items:center;gap:2px;background:#e8e4dc;border-radius:24px;padding:3px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;}
        .nav-tabs::-webkit-scrollbar{display:none;}
        .nav-inner{display:flex;align-items:center;justify-content:space-between;max-width:960px;margin:0 auto;padding:0 24px;height:58px;}
        .rec-detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
        .compare-stats{display:flex;gap:14px;}
        @media(max-width:640px){
          .nav-inner{padding:0 12px;height:52px;}
          .nav-tabs{padding:2px;}
          .pill-tab{padding:6px 12px;font-size:12px;}
          .grid-2col{grid-template-columns:1fr;}
          .grid-3col{grid-template-columns:1fr 1fr;}
          .rec-detail-grid{grid-template-columns:1fr;}
          .compare-stats{flex-direction:column;gap:4px;}
          .form-card{padding:16px!important;border-radius:14px!important;}
          .hero-section{padding:32px 0 28px!important;}
          .content-padding{padding:0 12px!important;}
          .result-card-inner{padding:12px 14px!important;}
          .rec-card-inner{padding:12px 14px!important;}
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{background:"#f0ede8",borderBottom:"1px solid #e0dbd2",position:"sticky",top:0,zIndex:50,backdropFilter:"blur(8px)"}}>
        <div className="nav-inner">
          <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
            <div style={{width:30,height:30,borderRadius:8,background:"#1a1a1a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>⚖️</div>
            <span style={{fontFamily:"'Instrument Serif',serif",fontSize:18,fontWeight:400,color:"#1a1a1a",letterSpacing:"-0.3px"}}>ScholarshipIQ</span>
          </div>
          <div className="nav-tabs">
            {tabs.map(t => (
              <button key={t.id} className="pill-tab" onClick={() => setActiveTab(t.id)} style={{
                background:activeTab===t.id?"#fff":"transparent",
                color:activeTab===t.id?"#1a1a1a":"#666",
                boxShadow:activeTab===t.id?"0 1px 4px rgba(0,0,0,0.1)":"none",
              }}>{t.label}</button>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
            <span style={{fontSize:11,color:"#999",fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",display:"none"}}>2025 ABA 509</span>
          </div>
        </div>
      </nav>

      <div className="content-padding" style={{maxWidth:960,margin:"0 auto",padding:"0 24px"}}>

        {/* ── ESTIMATOR ── */}
        {activeTab==="estimator" && (
          <div style={{opacity:mounted?1:0,transition:"opacity 0.3s"}}>
            {/* Hero */}
            <div className="hero-section" style={{textAlign:"center",padding:"56px 0 44px"}}>
              <div style={{display:"inline-block",background:"#e8e4dc",borderRadius:20,padding:"4px 14px",fontSize:11,fontWeight:600,color:"#666",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:20}}>
                2025–26 Admissions Cycle
              </div>
              <h1 style={{fontFamily:"'Instrument Serif',serif",fontSize:"clamp(36px,5vw,56px)",fontWeight:400,lineHeight:1.1,color:"#1a1a1a",letterSpacing:"-1px",marginBottom:16}}>
                The scholarship estimator<br/><em>for serious applicants</em>
              </h1>
              <p style={{fontSize:16,color:"#666",lineHeight:1.6,maxWidth:480,margin:"0 auto"}}>
                Accept, waitlist, and deny probabilities — plus timing-adjusted scholarship estimates — across 35 ABA-accredited schools.
              </p>
            </div>

            {/* Form card */}
            <div className="form-card" style={{background:"#fff",borderRadius:20,border:"1px solid #e0dbd2",padding:32,marginBottom:16,boxShadow:"0 2px 12px rgba(0,0,0,0.04)"}}>
              <h2 style={{fontSize:13,fontWeight:600,color:"#999",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:24}}>Your Profile</h2>

              {/* GPA + LSAT */}
              <div className="grid-2col" style={{marginBottom:20}}>
                {[
                  {label:"Cumulative GPA",value:gpa,set:setGpa,min:2.0,max:4.33,step:.01,ph:"3.85",ok:gpaOk||!gpa,pct:gpa?((gpaNum-2)/2.33*100):0,r:[2.0,4.33]},
                  {label:"LSAT Score",value:lsat,set:setLsat,min:120,max:180,step:1,ph:"168",ok:lsatOk||!lsat,pct:lsat?((lsatNum-120)/60*100):0,r:[120,180]}
                ].map(f => (
                  <div key={f.label}>
                    <label style={{display:"block",fontSize:12,fontWeight:600,color:"#888",marginBottom:6,letterSpacing:"0.05em"}}>{f.label}</label>
                    <input value={f.value} onChange={e=>f.set(e.target.value)} placeholder={f.ph}
                      type="number" step={f.step} min={f.min} max={f.max}
                      style={{width:"100%",padding:"11px 14px",border:`1.5px solid ${f.value&&!f.ok?"#e05c2a":f.value&&f.ok?"#c8c2ba":"#e0dbd2"}`,borderRadius:10,fontSize:18,fontWeight:700,color:"#1a1a1a",background:f.value&&f.ok?"#fff":"#faf9f7",transition:"border-color 0.2s"}}/>
                    {f.value && f.ok && (
                      <div style={{marginTop:7}}>
                        <div style={{height:3,borderRadius:3,background:"#e8e4dc",overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${Math.min(100,f.pct)}%`,background:"#e05c2a",borderRadius:3,transition:"width 0.7s ease"}}/>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",marginTop:3,fontSize:10,color:"#bbb"}}>
                          <span>{f.r[0]}</span><span>{f.r[1]}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Application Date */}
              <div className="grid-2col" style={{marginBottom:20}}>
                <div>
                  <label style={{display:"block",fontSize:12,fontWeight:600,color:"#888",marginBottom:6,letterSpacing:"0.05em"}}>
                    Application Date <span style={{fontWeight:400,color:"#bbb"}}>(optional)</span>
                  </label>
                  <input value={appDate} onChange={e=>setAppDate(e.target.value)} type="date"
                    min="2025-09-01" max="2026-06-30"
                    style={{width:"100%",padding:"11px 14px",border:"1.5px solid #e0dbd2",borderRadius:10,fontSize:14,fontWeight:500,color:"#1a1a1a",background:"#faf9f7"}}/>
                </div>
                <div style={{display:"flex",alignItems:"center"}}>
                  {appDate ? (
                    <div style={{padding:"12px 16px",background:"#faf9f7",borderRadius:10,border:"1px solid #e0dbd2",width:"100%"}}>
                      <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}>
                        <div style={{width:7,height:7,borderRadius:"50%",background:timing.color,flexShrink:0}}/>
                        <span style={{fontSize:12,fontWeight:700,color:timing.color}}>{timing.label}</span>
                      </div>
                      <div style={{fontSize:12,color:"#888",lineHeight:1.5}}>{timing.desc}</div>
                    </div>
                  ) : (
                    <div style={{fontSize:12,color:"#bbb",lineHeight:1.7,padding:"12px 0"}}>
                      Adding a date adjusts probabilities and scholarship estimates based on rolling admissions cycle data.
                    </div>
                  )}
                </div>
              </div>

              {/* Softs + URM */}
              <div className="grid-2col" style={{marginBottom:24,paddingBottom:24,borderBottom:"1px solid #f0ede8"}}>
                <div>
                  <label style={{display:"flex",alignItems:"center",gap:5,fontSize:12,fontWeight:600,color:"#888",marginBottom:8,letterSpacing:"0.05em"}}>
                    Soft Factors
                    <span style={{position:"relative",display:"inline-flex",cursor:"help"}} className="softs-tip-wrap">
                      <span style={{width:15,height:15,borderRadius:"50%",background:"#e0dbd2",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#999",lineHeight:1}}>?</span>
                      <span className="softs-tip" style={{position:"absolute",bottom:"calc(100% + 8px)",left:"50%",transform:"translateX(-50%)",width:240,padding:"10px 12px",borderRadius:10,background:"#1a1a1a",color:"#e8e4dc",fontSize:11,lineHeight:1.6,fontWeight:400,letterSpacing:"0",boxShadow:"0 8px 24px rgba(0,0,0,0.2)",pointerEvents:"none",opacity:0,transition:"opacity 0.15s",zIndex:60,textAlign:"left"}}>
                        Work experience, leadership, community involvement, publications, and personal statement strength. <strong style={{color:"#e05c2a"}}>Excellent</strong> = T14-level WE, notable achievements. <strong style={{color:"#fbbf24"}}>Good</strong> = solid WE or strong extracurriculars. <strong style={{color:"#ccc"}}>Average</strong> = standard applicant profile.
                        <span style={{position:"absolute",bottom:-5,left:"50%",transform:"translateX(-50%) rotate(45deg)",width:10,height:10,background:"#1a1a1a"}}/>
                      </span>
                    </span>
                  </label>
                  <div style={{display:"flex",gap:6}}>
                    {["average","good","excellent"].map(s => (
                      <button key={s} onClick={() => setSofts(s)} style={{
                        flex:1,padding:"8px 4px",borderRadius:8,border:`1.5px solid ${softs===s?"#1a1a1a":"#e0dbd2"}`,
                        cursor:"pointer",fontSize:13,fontWeight:softs===s?700:400,
                        background:softs===s?"#1a1a1a":"#faf9f7",
                        color:softs===s?"#fff":"#666",transition:"all 0.15s"
                      }}>{s.charAt(0).toUpperCase()+s.slice(1)}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{display:"block",fontSize:12,fontWeight:600,color:"#888",marginBottom:8,letterSpacing:"0.05em"}}>URM Status</label>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div onClick={() => setUrm(!urm)} style={{
                      width:44,height:24,borderRadius:12,cursor:"pointer",position:"relative",
                      background:urm?"#1a1a1a":"#e0dbd2",transition:"background 0.25s",flexShrink:0
                    }}>
                      <div style={{position:"absolute",top:3,left:urm?22:3,width:18,height:18,borderRadius:9,background:"#fff",transition:"left 0.22s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}}/>
                    </div>
                    <span style={{fontSize:13,color:urm?"#1a1a1a":"#999",fontWeight:urm?600:400}}>{urm?"Yes — applied":"Not applicable"}</span>
                  </div>
                </div>
              </div>

              {/* School Search */}
              <div>
                <label style={{display:"block",fontSize:12,fontWeight:600,color:"#888",marginBottom:8,letterSpacing:"0.05em"}}>
                  Target Schools <span style={{fontWeight:400,color:"#bbb"}}>({selected.length} selected)</span>
                </label>
                <div style={{position:"relative"}}>
                  <input value={search}
                    onChange={e=>{setSearch(e.target.value);setShowDrop(true);}}
                    onFocus={()=>setShowDrop(true)}
                    onBlur={()=>setTimeout(()=>setShowDrop(false),160)}
                    placeholder="Search or browse 100 schools..."
                    style={{width:"100%",padding:"11px 14px",border:"1.5px solid #e0dbd2",borderRadius:10,fontSize:14,fontWeight:400,color:"#1a1a1a",background:"#faf9f7",transition:"border-color 0.2s",boxSizing:"border-box"}}
                    onFocusCapture={e=>{e.target.style.borderColor="#1a1a1a";}}
                    onBlurCapture={e=>{e.target.style.borderColor="#e0dbd2";}}
                  />
                  {showDrop && filtered.length > 0 && (
                    <div style={{
                      position:"absolute",top:"calc(100% + 5px)",left:0,right:0,zIndex:100,borderRadius:12,
                      background:"#fff",border:"1px solid #e0dbd2",
                      boxShadow:"0 16px 40px rgba(0,0,0,0.12)",
                      overflowY:"auto",maxHeight:300
                    }}>
                      {filtered.map((s,i) => (
                        <div key={s.name} className="school-row" onMouseDown={() => addSchool(s)} style={{
                          padding:"10px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",
                          alignItems:"center",borderBottom:i<filtered.length-1?"1px solid #f0ede8":"none",
                          background:"#fff"
                        }}>
                          <div>
                            <div style={{fontSize:13,fontWeight:500,color:"#1a1a1a"}}>{s.name}</div>
                            <div style={{fontSize:11,color:"#999",marginTop:1}}>
                              #{s.usNews} US News &middot; {s.city}, {s.state} &middot; {Math.round(s.accept_rate*100)}% accept &middot; {s.median_lsat} / {s.median_gpa}
                            </div>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0,marginLeft:8}}>
                            <div style={{width:7,height:7,borderRadius:"50%",background:TIER_DOT[s.tier]}}/>
                            <span style={{fontSize:11,color:TIER_DOT[s.tier],fontWeight:600}}>{TIER_META[s.tier].label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {selected.length > 0 && (
                  <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:10}}>
                    {selected.map(s => (
                      <div key={s.name} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px 4px 10px",borderRadius:20,fontSize:12,fontWeight:500,background:"#f0ede8",border:"1px solid #e0dbd2",color:"#444"}}>
                        <div style={{width:5,height:5,borderRadius:"50%",background:TIER_DOT[s.tier],flexShrink:0}}/>
                        {s.name}
                        <button onClick={() => removeSchool(s.name)} style={{background:"none",border:"none",color:"#aaa",cursor:"pointer",padding:"0 0 0 3px",fontSize:14,lineHeight:1,transition:"color 0.15s"}}
                          onMouseOver={e=>e.target.style.color="#333"} onMouseOut={e=>e.target.style.color="#aaa"}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button className="cta-btn" onClick={runEstimate} disabled={!canGo||loading} style={{
              width:"100%",padding:"15px",borderRadius:12,border:"none",
              cursor:canGo?"pointer":"not-allowed",fontSize:15,fontWeight:600,letterSpacing:"0.01em",
              background:canGo?"#e05c2a":"#e0dbd2",
              color:canGo?"#fff":"#aaa",
              boxShadow:canGo?"0 2px 12px rgba(224,92,42,0.25)":"none",
              transition:"all 0.18s",display:"flex",alignItems:"center",justifyContent:"center",gap:8
            }}>
              {loading ? <><span className="spin" style={{display:"inline-block",width:16,height:16,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%"}}></span> Calculating...</> : "Estimate my chances →"}
            </button>

            <button onClick={getRecommendations} disabled={!canRec||recsLoading} style={{
              width:"100%",marginTop:10,padding:"13px",borderRadius:12,border:"1.5px solid #e0dbd2",
              cursor:canRec?"pointer":"not-allowed",fontSize:14,fontWeight:500,
              background:"#fff",color:canRec?"#333":"#bbb",
              transition:"all 0.18s",display:"flex",alignItems:"center",justifyContent:"center",gap:8
            }}
              onMouseOver={e=>{if(canRec)e.currentTarget.style.background="#f0ede8";}}
              onMouseOut={e=>e.currentTarget.style.background="#fff"}
            >
              {recsLoading?<><span className="spin" style={{display:"inline-block",width:14,height:14,border:"2px solid #ddd",borderTopColor:"#999",borderRadius:"50%"}}></span> Generating...</>:"🎯 Get school recommendations"}
            </button>

            <p style={{textAlign:"center",fontSize:11,color:"#bbb",marginTop:12,lineHeight:1.6}}>
              Based on 2025 ABA 509 data · LSD.law cycle decisions · Spivey Consulting methodology
            </p>
          </div>
        )}

        {/* ── RESULTS ── */}
        {activeTab==="results" && (
          <div style={{padding:"32px 0"}}>
            {results.length === 0 ? (
              <div style={{textAlign:"center",padding:"80px 0"}}>
                <div style={{fontSize:48,marginBottom:16}}>📊</div>
                <p style={{fontSize:16,color:"#666",marginBottom:20}}>No results yet. Fill in your stats and run an estimate.</p>
                <button className="outline-btn" onClick={() => setActiveTab("estimator")} style={{padding:"10px 22px",borderRadius:10,border:"1.5px solid #e0dbd2",background:"#fff",color:"#333",cursor:"pointer",fontSize:14,fontWeight:500}}>← Back to Estimator</button>
              </div>
            ) : (
              <div>
                {/* Results header */}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap",gap:12}}>
                  <div>
                    <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:28,fontWeight:400,color:"#1a1a1a",letterSpacing:"-0.5px",marginBottom:4}}>
                      Your estimates
                    </h2>
                    <p style={{fontSize:13,color:"#999"}}>
                      GPA {gpa} &middot; LSAT {lsat} &middot; {results.length} school{results.length>1?"s":""}
                      {appDate && <span style={{color:timing.color}}> &middot; {timing.label}</span>}
                    </p>
                  </div>
                  <button onClick={getAI} disabled={aiLoading} className="cta-btn" style={{
                    padding:"9px 18px",borderRadius:10,border:"none",
                    background:aiLoading?"#f0ede8":"#1a1a1a",color:aiLoading?"#999":"#fff",
                    cursor:"pointer",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:6,
                    boxShadow:aiLoading?"none":"0 2px 8px rgba(0,0,0,0.15)"
                  }}>
                    {aiLoading?<><span className="spin" style={{display:"inline-block",width:13,height:13,border:"2px solid #ccc",borderTopColor:"#666",borderRadius:"50%"}}></span> Analyzing...</>:"✦ AI Strategy"}
                  </button>
                </div>

                {appDate && timing.admPenalty > 0 && (
                  <div style={{marginBottom:16,padding:"12px 16px",borderRadius:10,background:"#fff8f5",border:`1px solid ${timing.color}33`,display:"flex",gap:10,alignItems:"flex-start"}}>
                    <span style={{fontSize:16,flexShrink:0}}>⏱</span>
                    <div style={{fontSize:13,lineHeight:1.6}}>
                      <span style={{fontWeight:700,color:timing.color}}>{timing.label} — </span>
                      <span style={{color:"#666"}}>{timing.desc}</span>
                    </div>
                  </div>
                )}

                {aiInsight && (
                  <div className="fade-up" style={{marginBottom:16,padding:"16px 18px",borderRadius:12,background:"#fff",border:"1px solid #e0dbd2",boxShadow:"0 2px 12px rgba(0,0,0,0.04)"}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#e05c2a",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.1em"}}>✦ AI Strategy</div>
                    <p style={{fontSize:13,lineHeight:1.75,color:"#333"}}>{aiInsight}</p>
                  </div>
                )}

                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {results.map((r,i) => {
                    const isOpen = expanded === r.name;
                    const seatsColor = r.seats===0?"#cc3b2a":r.seats<30?"#d97c1a":r.seats<80?"#d4a017":"#2d9e5f";
                    return (
                      <div key={r.name} className="result-card" style={{
                        background:"#fff",borderRadius:14,border:"1px solid #e0dbd2",
                        overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.04)",
                        borderLeft:`3px solid ${TIER_DOT[r.tier]}`
                      }} onClick={() => setExpanded(isOpen?null:r.name)}>
                        <div className="result-card-inner" style={{padding:"16px 18px"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,flexWrap:"wrap",gap:8}}>
                            <div>
                              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:3}}>
                                <span style={{fontSize:11,color:"#bbb",fontWeight:600}}>#{i+1}</span>
                                <span style={{fontWeight:700,fontSize:15,color:"#1a1a1a"}}>{r.name}</span>
                                <span style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:`${TIER_DOT[r.tier]}15`,color:TIER_DOT[r.tier],fontWeight:600,border:`1px solid ${TIER_DOT[r.tier]}30`}}>
                                  {TIER_META[r.tier].label}
                                </span>
                                <span style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:`${seatsColor}12`,color:seatsColor,fontWeight:600,border:`1px solid ${seatsColor}25`}}>
                                  {r.seats===0?"⚠ Near Capacity":r.seats<30?`⚡ ~${r.seats} seats`:`~${r.seats} seats`}
                                </span>
                              </div>
                              <div style={{fontSize:11,color:"#bbb",display:"flex",gap:10}}>
                                <span>GPA: <span style={{color:"#888"}}>{r.gpaPos}</span></span>
                                <span>LSAT: <span style={{color:"#888"}}>{r.lsatPos}</span></span>
                              </div>
                            </div>
                            <div style={{textAlign:"right",flexShrink:0}}>
                              <div style={{fontSize:13,fontWeight:700,color:r.scholColor}}>{r.scholEmoji} {r.scholLabel}</div>
                              <div style={{fontSize:11,color:"#999",marginTop:2}}>
                                {r.estMax>0?`~$${r.estMin.toLocaleString()}–$${r.estMax.toLocaleString()}/yr`:"No aid est."}
                              </div>
                            </div>
                          </div>

                          {/* Outcome block */}
                          <div style={{background:"#faf9f7",borderRadius:10,padding:"12px 14px",border:"1px solid #f0ede8"}}>
                            <div style={{fontSize:10,fontWeight:700,color:"#bbb",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Admission Outcome Estimates</div>
                            <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                              <div style={{position:"relative",flexShrink:0}}>
                                <OutcomeDonut accept={r.accept} waitlist={r.waitlist} deny={r.deny} size={80}/>
                                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
                                  <div style={{fontSize:17,fontWeight:800,color:"#2d9e5f",lineHeight:1}}>{r.accept}%</div>
                                  <div style={{fontSize:9,color:"#bbb",marginTop:1}}>accept</div>
                                </div>
                              </div>
                              <div style={{flex:1,minWidth:120}}>
                                {[{label:"Accept",pct:r.accept,color:"#2d9e5f"},{label:"Waitlist",pct:r.waitlist,color:"#d97c1a"},{label:"Deny",pct:r.deny,color:"#cc3b2a"}].map(o=>(
                                  <div key={o.label} style={{marginBottom:7}}>
                                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:12}}>
                                      <span style={{color:"#888"}}>{o.label}</span>
                                      <span style={{fontWeight:700,color:o.color}}>{o.pct}%</span>
                                    </div>
                                    <StatBar pct={o.pct} color={o.color} height={4}/>
                                  </div>
                                ))}
                              </div>
                              <div style={{display:"flex",flexDirection:"column",gap:7,flexShrink:0}}>
                                <div style={{background:"#fff",borderRadius:8,padding:"7px 11px",textAlign:"center",border:"1px solid #e0dbd2"}}>
                                  <div style={{fontSize:10,color:"#bbb",marginBottom:2}}>ABA Accept</div>
                                  <div style={{fontSize:15,fontWeight:700,color:"#1a1a1a"}}>{Math.round(r.accept_rate*100)}%</div>
                                </div>
                                <div style={{background:"#fff",borderRadius:8,padding:"7px 11px",textAlign:"center",border:"1px solid #e0dbd2"}}>
                                  <div style={{fontSize:10,color:"#bbb",marginBottom:2}}>Schol Likelihood</div>
                                  <div style={{fontSize:15,fontWeight:700,color:"#e05c2a"}}>{r.scholLikelihood}%</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expanded detail */}
                        {isOpen && (
                          <div style={{padding:"0 18px 16px",borderTop:"1px solid #f0ede8",paddingTop:14}}>
                            <div className="grid-2col" style={{marginBottom:12}}>
                              {[{label:"GPA",val:gpaNum,p25:r.p25_gpa,med:r.median_gpa,p75:r.p75_gpa,fmt:v=>v.toFixed(2)},{label:"LSAT",val:lsatNum,p25:r.p25_lsat,med:r.median_lsat,p75:r.p75_lsat,fmt:v=>v}].map(({label,val,p25,med,p75,fmt})=>{
                                const pct=Math.min(100,Math.max(0,((val-p25)/(p75-p25))*100));
                                return (
                                  <div key={label} style={{background:"#faf9f7",borderRadius:9,padding:"10px 12px",border:"1px solid #f0ede8"}}>
                                    <div style={{fontSize:10,color:"#bbb",marginBottom:6,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em"}}>{label} vs Enrolled Class</div>
                                    <div style={{position:"relative",height:6,borderRadius:3,background:"#e8e4dc",marginBottom:6}}>
                                      <div style={{position:"absolute",left:`${Math.min(97,Math.max(2,((med-p25)/(p75-p25))*100))}%`,top:-2,width:1.5,height:10,background:"#ccc",borderRadius:1}}/>
                                      <div style={{position:"absolute",left:`${Math.min(95,Math.max(2,pct))}%`,top:-3,width:12,height:12,borderRadius:"50%",background:"#e05c2a",transform:"translate(-50%,0)",boxShadow:"0 0 6px rgba(224,92,42,0.4)",transition:"left 0.5s ease"}}/>
                                    </div>
                                    <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#bbb"}}>
                                      <span>{fmt(p25)}</span><span style={{color:"#999"}}>med</span><span>{fmt(p75)}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="grid-3col" style={{marginBottom:appDate?12:0}}>
                              {[{label:"Tuition",val:`$${r.tuition.toLocaleString()}`},{label:"% Receiving Aid",val:`${r.pct_grant}%`},{label:"% Half+",val:`${r.pct_half}%`},{label:"Median Grant",val:`$${r.med_grant.toLocaleString()}`},{label:"P25 Grant",val:`$${r.p25_grant.toLocaleString()}`},{label:"P75 Grant",val:`$${r.p75_grant.toLocaleString()}`}].map(({label,val})=>(
                                <div key={label} style={{background:"#faf9f7",borderRadius:8,padding:"8px 10px",border:"1px solid #f0ede8"}}>
                                  <div style={{fontSize:10,color:"#bbb",marginBottom:2}}>{label}</div>
                                  <div style={{fontWeight:700,color:"#444",fontSize:13}}>{val}</div>
                                </div>
                              ))}
                            </div>
                            {appDate && (
                              <div style={{background:"#faf9f7",borderRadius:9,padding:"10px 12px",border:"1px solid #f0ede8"}}>
                                <div style={{fontSize:10,fontWeight:700,color:"#bbb",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Timing · {timing.label}</div>
                                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,fontSize:11}}>
                                  <div><span style={{color:"#bbb"}}>Adm: </span><span style={{color:timing.color,fontWeight:700}}>-{Math.round(r.admPenalty*100)}%</span></div>
                                  <div><span style={{color:"#bbb"}}>Schol: </span><span style={{color:timing.color,fontWeight:700}}>-{Math.round(r.scholPenalty*100)}%</span></div>
                                  <div><span style={{color:"#bbb"}}>WL+: </span><span style={{color:"#d97c1a",fontWeight:700}}>+{Math.round((timing.wlShift||0)*100)}pp</span></div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        <div style={{textAlign:"center",padding:"2px 0 8px",fontSize:10,color:"#ccc"}}>
                          {isOpen?"▲ collapse":"▼ expand details"}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{marginTop:14,padding:"12px 14px",borderRadius:10,background:"#fff",border:"1px solid #f0ede8",fontSize:11,color:"#bbb",lineHeight:1.7}}>
                  <strong style={{color:"#999"}}>Sources:</strong> ABA Standard 509 2025 · LSD.Law 2025-26 cycle · Spivey Consulting methodology · BARBRI/LawSchoolNumbers timing research · AccessLex application timing study. Outcomes are probabilistic estimates — individual results vary.
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── RECOMMENDATIONS ── */}
        {activeTab==="recommendations" && (
          <div style={{padding:"32px 0"}}>
            <div style={{marginBottom:28}}>
              <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:32,fontWeight:400,color:"#1a1a1a",letterSpacing:"-0.5px",marginBottom:6}}>
                School recommendations
              </h2>
              <p style={{fontSize:14,color:"#888",lineHeight:1.6}}>
                AI-curated reach, target, and safety picks based on your GPA {gpaNum ? gpaNum.toFixed(2) : "—"} and LSAT {lsatNum || "—"}.
              </p>
            </div>

            {recsLoading && (
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 0",gap:16}}>
                <div style={{width:40,height:40,border:"3px solid #e0dbd2",borderTopColor:"#e05c2a",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
                <p style={{fontSize:14,color:"#999"}}>Analyzing your profile across 35 schools...</p>
              </div>
            )}

            {!recsLoading && !recs && (
              <div style={{textAlign:"center",padding:"60px 0"}}>
                <div style={{fontSize:52,marginBottom:16}}>🎯</div>
                <p style={{fontSize:16,color:"#666",marginBottom:8}}>Enter your GPA and LSAT on the Estimator tab,</p>
                <p style={{fontSize:16,color:"#666",marginBottom:24}}>then come back and generate your recommendations.</p>
                <button onClick={()=>setActiveTab("estimator")} className="outline-btn" style={{padding:"10px 22px",borderRadius:10,border:"1.5px solid #e0dbd2",background:"#fff",color:"#333",cursor:"pointer",fontSize:14,fontWeight:500}}>← Go to Estimator</button>
              </div>
            )}

            {!recsLoading && recs && recs.error && (
              recs.error === "shared_link" ? (
                <div style={{textAlign:"center",padding:"50px 20px"}}>
                  <div style={{fontSize:48,marginBottom:16}}>🔒</div>
                  <h3 style={{fontFamily:"'Instrument Serif',serif",fontSize:22,fontWeight:400,color:"#1a1a1a",marginBottom:10}}>AI Recommendations</h3>
                  <p style={{fontSize:14,color:"#666",lineHeight:1.7,maxWidth:420,margin:"0 auto 20px"}}>
                    AI-powered recommendations are available when running ScholarshipIQ directly in Claude. The estimator, results, and compare features work fully on shared links.
                  </p>
                  <button onClick={()=>setActiveTab("estimator")} className="outline-btn" style={{padding:"10px 22px",borderRadius:10,border:"1.5px solid #e0dbd2",background:"#fff",color:"#333",cursor:"pointer",fontSize:14,fontWeight:500}}>← Use the Estimator</button>
                </div>
              ) : (
                <div style={{padding:20,background:"#fff5f5",borderRadius:12,border:"1px solid #fcc",color:"#c00",fontSize:14}}>{recs.error}</div>
              )
            )}

            {!recsLoading && recs && !recs.error && (() => {
              const allStates = [...new Set(SCHOOLS.map(s => s.state))].sort();

              return (
              <div className="fade-up">
                {/* Summary card */}
                <div style={{background:"#1a1a1a",borderRadius:16,padding:"20px 24px",marginBottom:24,boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#e05c2a",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>✦ Strategic Overview</div>
                  <p style={{fontSize:15,color:"#e8e4dc",lineHeight:1.75}}>{recs.summary}</p>
                </div>

                {/* Filters */}
                <div style={{background:"#fff",borderRadius:12,border:"1px solid #e0dbd2",padding:"14px 18px",marginBottom:20,boxShadow:"0 1px 4px rgba(0,0,0,0.03)"}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Filter & Regenerate</div>
                  <div className="grid-2col">
                    <div>
                      <label style={{display:"block",fontSize:12,fontWeight:600,color:"#888",marginBottom:5}}>Preferred State</label>
                      <select value={recStateFilter} onChange={e => setRecStateFilter(e.target.value)}
                        style={{width:"100%",padding:"9px 12px",border:"1.5px solid #e0dbd2",borderRadius:8,fontSize:13,fontWeight:500,color:"#1a1a1a",background:"#faf9f7",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                        <option value="">All States</option>
                        {allStates.map(st => <option key={st} value={st}>{st}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{display:"block",fontSize:12,fontWeight:600,color:"#888",marginBottom:5}}>Max Tuition</label>
                      <select value={recTuitionMax} onChange={e => setRecTuitionMax(e.target.value)}
                        style={{width:"100%",padding:"9px 12px",border:"1.5px solid #e0dbd2",borderRadius:8,fontSize:13,fontWeight:500,color:"#1a1a1a",background:"#faf9f7",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                        <option value="">Any Tuition</option>
                        <option value="30">Under $30k</option>
                        <option value="40">Under $40k</option>
                        <option value="50">Under $50k</option>
                        <option value="60">Under $60k</option>
                        <option value="70">Under $70k</option>
                        <option value="80">Under $80k</option>
                      </select>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
                    {(recStateFilter || recTuitionMax) && (
                      <>
                        <button onClick={getRecommendations} disabled={recsLoading}
                          style={{padding:"7px 16px",borderRadius:8,border:"none",background:"#e05c2a",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600,transition:"all 0.15s",boxShadow:"0 2px 8px rgba(224,92,42,0.25)"}}
                          onMouseOver={e=>e.target.style.background="#c94d1e"} onMouseOut={e=>e.target.style.background="#e05c2a"}
                        >🎯 Regenerate with filters</button>
                        <button onClick={() => { setRecStateFilter(""); setRecTuitionMax(""); }}
                          style={{padding:"7px 14px",borderRadius:8,border:"1px solid #e0dbd2",background:"#faf9f7",color:"#888",cursor:"pointer",fontSize:12,fontWeight:500,transition:"all 0.15s"}}
                          onMouseOver={e=>e.target.style.background="#e8e4dc"} onMouseOut={e=>e.target.style.background="#faf9f7"}
                        >✕ Clear</button>
                      </>
                    )}
                  </div>
                </div>

                {/* Buckets */}
                {[
                  { key:"reach", label:"Reach Schools", emoji:"🚀", desc:"Long shots worth the application", color:"#cc3b2a", bg:"#fff8f7", border:"#fad5d0" },
                  { key:"target", label:"Target Schools", emoji:"🎯", desc:"Strong fits where you're competitive", color:"#2a7ae0", bg:"#f6f9ff", border:"#cddcfa" },
                  { key:"safety", label:"Safety Schools", emoji:"🏆", desc:"High-probability admits with scholarship upside", color:"#2d9e5f", bg:"#f5fbf8", border:"#c0e8d2" },
                ].map(bucket => {
                  const bucketSchools = recs[bucket.key] || [];
                  return (
                  <div key={bucket.key} style={{marginBottom:20}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                      <span style={{fontSize:20}}>{bucket.emoji}</span>
                      <div>
                        <h3 style={{fontSize:16,fontWeight:700,color:"#1a1a1a",letterSpacing:"-0.2px"}}>{bucket.label}</h3>
                        <p style={{fontSize:12,color:"#999"}}>{bucket.desc}</p>
                      </div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:10}}>
                      {bucketSchools.length === 0 && (
                        <div style={{padding:"16px",background:"#faf9f7",borderRadius:10,border:"1px solid #f0ede8",fontSize:13,color:"#bbb",textAlign:"center"}}>
                          No schools in this category
                        </div>
                      )}
                      {bucketSchools.map((school, si) => {
                        const schoolData = SCHOOLS.find(s => s.name === school.name);
                        return (
                          <div key={si} className="rec-card-inner" style={{background:"#fff",borderRadius:13,border:`1px solid ${bucket.border}`,padding:"16px 18px",boxShadow:"0 1px 6px rgba(0,0,0,0.04)",borderLeft:`3px solid ${bucket.color}`}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8,marginBottom:10}}>
                              <div>
                                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:3}}>
                                  <span style={{fontWeight:700,fontSize:15,color:"#1a1a1a"}}>{school.name}</span>
                                  {schoolData && (
                                    <>
                                      <span style={{fontSize:11,fontWeight:700,color:"#999"}}>#{schoolData.usNews}</span>
                                      <span style={{fontSize:10,padding:"2px 8px",borderRadius:20,background:`${TIER_DOT[schoolData.tier]}15`,color:TIER_DOT[schoolData.tier],fontWeight:600,border:`1px solid ${TIER_DOT[schoolData.tier]}30`}}>
                                        {TIER_META[schoolData.tier].label}
                                      </span>
                                    </>
                                  )}
                                </div>
                                {schoolData && (
                                  <>
                                    <div style={{fontSize:12,color:"#666",marginBottom:3}}>
                                      📍 {schoolData.city}, {schoolData.state}
                                    </div>
                                    <div style={{display:"flex",gap:12,fontSize:11,color:"#bbb",flexWrap:"wrap"}}>
                                      <span>Accept: <span style={{color:"#666",fontWeight:600}}>{Math.round(schoolData.accept_rate*100)}%</span></span>
                                      <span>Med LSAT: <span style={{color:"#666",fontWeight:600}}>{schoolData.median_lsat}</span></span>
                                      <span>Med GPA: <span style={{color:"#666",fontWeight:600}}>{schoolData.median_gpa}</span></span>
                                      <span>Tuition: <span style={{color:"#666",fontWeight:600}}>${schoolData.tuition.toLocaleString()}</span></span>
                                    </div>
                                  </>
                                )}
                              </div>
                              {schoolData && (
                                selected.find(s=>s.name===schoolData.name) ? (
                                  <span style={{
                                    padding:"5px 12px",borderRadius:8,border:"1.5px solid #a5d6a7",
                                    background:"#e6f4ea",color:"#2e7d32",fontSize:12,fontWeight:600,
                                    whiteSpace:"nowrap",flexShrink:0
                                  }}>✓ Added</span>
                                ) : (
                                  <button onClick={(e)=>{
                                    e.stopPropagation();
                                    addSchool(schoolData);
                                  }} style={{
                                    padding:"5px 12px",borderRadius:8,border:"1.5px solid #e0dbd2",
                                    background:"#faf9f7",color:"#444",cursor:"pointer",fontSize:12,fontWeight:600,
                                    whiteSpace:"nowrap",transition:"all 0.15s",flexShrink:0
                                  }}
                                    onMouseOver={e=>{e.target.style.background="#e8e4dc";e.target.style.borderColor="#ccc";}}
                                    onMouseOut={e=>{e.target.style.background="#faf9f7";e.target.style.borderColor="#e0dbd2";}}
                                  >+ Add to list</button>
                                )
                              )}
                            </div>
                            <div className="rec-detail-grid">
                              <div style={{background:bucket.bg,borderRadius:9,padding:"10px 12px"}}>
                                <div style={{fontSize:10,fontWeight:700,color:bucket.color,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>Why apply</div>
                                <div style={{fontSize:12,color:"#444",lineHeight:1.6}}>{school.reason}</div>
                              </div>
                              <div style={{background:"#faf9f7",borderRadius:9,padding:"10px 12px",border:"1px solid #f0ede8"}}>
                                <div style={{fontSize:10,fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>💡 Tactical tip</div>
                                <div style={{fontSize:12,color:"#444",lineHeight:1.6}}>{school.tip}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  );
                })}

                <button onClick={getRecommendations} style={{
                  width:"100%",marginTop:8,padding:"11px",borderRadius:10,
                  border:"1.5px solid #e0dbd2",background:"#fff",color:"#666",
                  cursor:"pointer",fontSize:13,fontWeight:500,transition:"all 0.15s"
                }}
                  onMouseOver={e=>e.currentTarget.style.background="#f0ede8"}
                  onMouseOut={e=>e.currentTarget.style.background="#fff"}
                >↻ Regenerate recommendations</button>
              </div>
              );
            })()}
          </div>
        )}

        {/* ── COMPARE ── */}
        {activeTab==="compare" && (
          <div style={{padding:"32px 0"}}>
            {results.length < 2 ? (
              <div style={{textAlign:"center",padding:"80px 0"}}>
                <div style={{fontSize:48,marginBottom:16}}>⚖️</div>
                <p style={{fontSize:16,color:"#666",marginBottom:20}}>Add 2+ schools and run estimates to compare.</p>
                <button className="outline-btn" onClick={() => setActiveTab("estimator")} style={{padding:"10px 22px",borderRadius:10,border:"1.5px solid #e0dbd2",background:"#fff",color:"#333",cursor:"pointer",fontSize:14,fontWeight:500}}>← Back to Estimator</button>
              </div>
            ) : (
              <div>
                <h2 style={{fontFamily:"'Instrument Serif',serif",fontSize:28,fontWeight:400,color:"#1a1a1a",letterSpacing:"-0.5px",marginBottom:20}}>Side-by-side comparison</h2>
                <div style={{background:"#fff",borderRadius:14,border:"1px solid #e0dbd2",overflow:"hidden",marginBottom:20,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
                  <div style={{overflowX:"auto"}}>
                    <table style={{width:"100%",minWidth:650,borderCollapse:"collapse",fontSize:13}}>
                      <thead>
                        <tr style={{borderBottom:"1px solid #f0ede8",background:"#faf9f7"}}>
                          {["School","Accept","Waitlist","Deny","Scholarship","Est. Aid/yr","Seats"].map(h=>(
                            <th key={h} style={{padding:"12px 14px",textAlign:h==="School"?"left":"center",color:"#999",fontWeight:600,fontSize:11,textTransform:"uppercase",letterSpacing:"0.08em",whiteSpace:"nowrap"}}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((r,i)=>{
                          const sc=r.seats===0?"#cc3b2a":r.seats<30?"#d97c1a":r.seats<80?"#d4a017":"#2d9e5f";
                          return (
                            <tr key={r.name} style={{borderBottom:"1px solid #f0ede8"}}>
                              <td style={{padding:"14px",borderLeft:`3px solid ${TIER_DOT[r.tier]}`}}>
                                <div style={{fontWeight:600,fontSize:13,color:"#1a1a1a"}}>{r.name}</div>
                                <div style={{fontSize:11,color:TIER_DOT[r.tier],marginTop:1,fontWeight:500}}>{TIER_META[r.tier].label} · #{i+1}</div>
                              </td>
                              <td style={{padding:"14px",textAlign:"center"}}><span style={{fontWeight:800,color:"#2d9e5f",fontSize:16}}>{r.accept}%</span></td>
                              <td style={{padding:"14px",textAlign:"center"}}><span style={{fontWeight:700,color:"#d97c1a"}}>{r.waitlist}%</span></td>
                              <td style={{padding:"14px",textAlign:"center"}}><span style={{fontWeight:700,color:"#cc3b2a"}}>{r.deny}%</span></td>
                              <td style={{padding:"14px",textAlign:"center"}}><span style={{color:r.scholColor,fontWeight:600}}>{r.scholEmoji} {r.scholLabel}</span></td>
                              <td style={{padding:"14px",textAlign:"center",color:r.estMax>0?"#666":"#ccc",fontSize:12}}>{r.estMax>0?`$${r.estMin.toLocaleString()}-$${r.estMax.toLocaleString()}`:"—"}</td>
                              <td style={{padding:"14px",textAlign:"center"}}><span style={{color:sc,fontWeight:700}}>{r.seats===0?"~0":r.seats}</span></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <h3 style={{fontSize:12,color:"#999",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Acceptance Probability Ranking</h3>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {[...results].sort((a,b)=>b.accept-a.accept).map(r=>(
                    <div key={r.name} style={{background:"#fff",borderRadius:11,border:"1px solid #e0dbd2",padding:"13px 16px",boxShadow:"0 1px 4px rgba(0,0,0,0.03)"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:13,flexWrap:"wrap",gap:6}}>
                        <span style={{fontWeight:600,color:"#1a1a1a"}}>{r.name}</span>
                        <div className="compare-stats">
                          <span style={{color:"#2d9e5f",fontWeight:700}}>{r.accept}% accept</span>
                          <span style={{color:"#d97c1a",fontWeight:600}}>{r.waitlist}% WL</span>
                          <span style={{color:"#cc3b2a",fontWeight:600}}>{r.deny}% deny</span>
                        </div>
                      </div>
                      <div style={{display:"flex",height:7,borderRadius:4,overflow:"hidden",gap:1}}>
                        <div style={{width:`${r.accept}%`,background:"#2d9e5f",transition:"width 0.8s ease"}}/>
                        <div style={{width:`${r.waitlist}%`,background:"#d97c1a",transition:"width 0.8s ease"}}/>
                        <div style={{width:`${r.deny}%`,background:"#cc3b2a",transition:"width 0.8s ease"}}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
      <Analytics />
    </div>
  );
}