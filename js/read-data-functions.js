function findCsvLoc(property_type) {
    if (property_type == "population") {
      csv_loc =
        "https://raw.githubusercontent.com/na105/F20DV_CW2_Datasets/main/Country-Population.csv";
    }
  
    if (property_type == "fertility_rate") {
      csv_loc =
        "https://raw.githubusercontent.com/na105/F20DV_CW2_Datasets/main/Fertility-Rate.csv";
    }
  
    if (property_type == "life_expectancy") {
      csv_loc =
        "https://raw.githubusercontent.com/na105/F20DV_CW2_Datasets/main/Life-Expectancy-At-Birth.csv";
    }
  
    if (property_type == "country_metadata") {
      csv_loc =
        "https://raw.githubusercontent.com/na105/F20DV_CW2_Datasets/main/Country-Metadata.csv";
    }
  
    return csv_loc;
  }
  
  function lookupCountryMetadata(country_code) {
    property_type = "country_metadata";
    csv_loc = findCsvLoc(property_type);
  
    final_data = d3.csv(csv_loc).then(function (data) {
      var property_data = data.map(function (d) {
        if (d["IncomeGroup"] == "Low income") {
          income_grp_key = "LI";
        }
        if (d["IncomeGroup"] == "High income: nonOECD") {
          income_grp_key = "HI";
        }
        if (d["IncomeGroup"] == "Upper middle income") {
          income_grp_key = "UMI";
        }
        if (d["IncomeGroup"] == "Lower middle income") {
          income_grp_key = "LMI";
        }
  
        return {
          country_code: d["Country Code"],
          country_name: d["Country Name"],
          income_grp_key: income_grp_key,
          income_grp_name: d["IncomeGroup"],
          region: d["Region"],
        };
      });
  
      if (country_code == "ALL") {
        return property_data;
      } else {
        filtered = property_data.filter(function (d) {
          return d.country_code == country_code;
        });
  
        return filtered;
      }
    });
    console.log("Final data", final_data);
    return final_data;
  }
  
  function aggPropertyValues(property_type, data) {
    if (property_type == "population") {
      agg = d3.sum(data);
    }
  
    if (property_type == "fertility_rate") {
      agg = d3.mean(data);
    }
  
    if (property_type == "life_expectancy") {
      agg = d3.mean(data);
    }
    return agg;
  }
  
  function propertyStatsPerYearPerCountry(property_type, year, country_code) {
    csv_loc = findCsvLoc(property_type);
  
    final_data = d3.csv(csv_loc).then(function (data) {
      if (country_code == "ALL") {
        //console.log("DATANEST record:",i," ,",d);
        var property_data = data.map(function (d) {
          return d[year];
        });
        //console.log("property_data record:",i," ,",property_data);
        var jsonData = {};
        var stats = [];
        jsonData["country_code"] = "ALL";
        jsonData["country_name"] = "World";
        jsonData["property_value"] = +aggPropertyValues(
          property_type,
          property_data
        );
        jsonData["property_type"] = property_type;
        jsonData["property_year"] = +year;
        stats.push(jsonData);
  
        console.log("Final Data", stats[0]);
        return stats[0];
      } else {
        filtered = data.filter(function (d) {
          return d["Country Code"] == country_code;
        });
  
        var property_data = filtered.map(function (d) {
          return {
            country_code: d["Country Code"],
            country_name: d["Country Name"],
            property_type: property_type,
            property_year: +year,
            property_value: +d[year],
          };
        });
        console.log("Final Data", property_data[0]);
        return property_data[0];
      }
    });
    return final_data;
  }
  
  function propertyStatsPerCountry(property_type, country_code) {
    csv_loc = findCsvLoc(property_type);
    final_data = d3.csv(csv_loc).then(function (data) {
      column_list = [
        "1960",
        "1961",
        "1962",
        "1963",
        "1964",
        "1965",
        "1966",
        "1967",
        "1968",
        "1969",
        "1970",
        "1971",
        "1972",
        "1973",
        "1974",
        "1975",
        "1976",
        "1977",
        "1978",
        "1979",
        "1980",
        "1981",
        "1982",
        "1983",
        "1984",
        "1985",
        "1986",
        "1987",
        "1988",
        "1989",
        "1990",
        "1991",
        "1992",
        "1993",
        "1994",
        "1995",
        "1996",
        "1997",
        "1998",
        "1999",
        "2000",
        "2001",
        "2002",
        "2003",
        "2004",
        "2005",
        "2006",
        "2007",
        "2008",
        "2009",
        "2010",
        "2011",
        "2012",
        "2013",
      ];
  
      csv_loc = findCsvLoc(property_type);
      data.forEach(function (d) {
        column_list.forEach(function (col, i) {
          d[col] = +d[col];
        });
      });
  
      if (country_code == "ALL") {
        var stats = [];
        column_list.forEach(function (year, i) {
          var property_data = data.map(function (d) {
            return d[year];
          });
          var jsonData = {};
          jsonData["country_code"] = "ALL";
          jsonData["country_name"] = "World";
          jsonData["property_value"] = +aggPropertyValues(
            property_type,
            property_data
          );
          jsonData["property_type"] = property_type;
          jsonData["property_year"] = +year;
          stats.push(jsonData);
        });
        console.log("Final Data", stats);
        return stats;
      } else {
        filtered = data.filter(function (d) {
          return d["Country Code"] == country_code;
        });
  
        var final_data = [];
        column_list.forEach(function (col, i) {
          var jsonData = {};
          jsonData["country_code"] = filtered[0]["Country Code"];
          jsonData["country_name"] = filtered[0]["Country Name"];
          jsonData["property_type"] = property_type;
          jsonData["property_year"] = +col;
          jsonData["property_value"] = +filtered[0][col];
          final_data.push(jsonData);
        });
  
        console.log("Final Data", final_data);
        return final_data;
      }
    });
    return final_data;
  }
  
  function propertyStatsForAllYearsForAllCountries(property_type) {
    csv_loc = findCsvLoc(property_type);
    final_data = d3.csv(csv_loc).then(function (data) {
      column_list = [
        "1960",
        "1961",
        "1962",
        "1963",
        "1964",
        "1965",
        "1966",
        "1967",
        "1968",
        "1969",
        "1970",
        "1971",
        "1972",
        "1973",
        "1974",
        "1975",
        "1976",
        "1977",
        "1978",
        "1979",
        "1980",
        "1981",
        "1982",
        "1983",
        "1984",
        "1985",
        "1986",
        "1987",
        "1988",
        "1989",
        "1990",
        "1991",
        "1992",
        "1993",
        "1994",
        "1995",
        "1996",
        "1997",
        "1998",
        "1999",
        "2000",
        "2001",
        "2002",
        "2003",
        "2004",
        "2005",
        "2006",
        "2007",
        "2008",
        "2009",
        "2010",
        "2011",
        "2012",
        "2013",
      ];
  
      csv_loc = findCsvLoc(property_type);
      data.forEach(function (d) {
        column_list.forEach(function (col, i) {
          d[col] = +d[col];
        });
      });
  
      var final_data = [];
  
      data.forEach(function (record) {
        column_list.forEach(function (col, i) {
          var jsonData = {};
          jsonData["country_code"] = record["Country Code"];
          jsonData["country_name"] = record["Country Name"];
          jsonData["property_type"] = property_type;
          jsonData["property_year"] = +col;
          jsonData["property_value"] = +record[col];
          final_data.push(jsonData);
        });
      });
      console.log("Final Data", final_data);
      return final_data;
    });
    return final_data;
  }
  
  function propertyStatsPerYear(property_type, year) {
    csv_loc = findCsvLoc(property_type);
  
    final_data = d3.csv(csv_loc).then(function (data) {
      var property_data = data.map(function (d) {
        return {
          country_code: d["Country Code"],
          country_name: d["Country Name"],
          property_type: property_type,
          property_year: +year,
          property_value: +d[year],
        };
      });
      console.log("Final Data", property_data);
      return property_data;
    });
    return final_data;
  }
  
  function combinedPropertyStatsPerYearPerCountry(year, country_code) {
    property_list = ["population", "fertility_rate", "life_expectancy"];
  
    final_data = Promise.all([
      propertyStatsPerYearPerCountry(property_list[0], year, country_code),
      propertyStatsPerYearPerCountry(property_list[1], year, country_code),
      propertyStatsPerYearPerCountry(property_list[2], year, country_code),
    ]).then(function (loadData) {
      property_1_data = loadData[0];
      property_2_data = loadData[1];
      property_3_data = loadData[2];
  
      var jsonData = {};
      jsonData["country_code"] = country_code;
      jsonData["property_year"] = +year;
      jsonData[property_list[0]] = property_1_data["property_value"];
      jsonData[property_list[1]] = property_2_data["property_value"];
      jsonData[property_list[2]] = property_3_data["property_value"];
  
      return jsonData;
    });
  
    console.log("Final Combined data PerYearPerCountry", final_data);
    return final_data;
  }
  
  function combinedPropertyStatsPerCountry(country_code) {
    property_list = ["population", "fertility_rate", "life_expectancy"];
  
    final_data = Promise.all([
      propertyStatsPerCountry(property_list[0], country_code),
      propertyStatsPerCountry(property_list[1], country_code),
      propertyStatsPerCountry(property_list[2], country_code),
    ]).then(function (loadData) {
      property_1_data = loadData[0];
      property_2_data = loadData[1];
      property_3_data = loadData[2];
  
      console.log("Combine data 1", property_1_data);
      console.log("Combine data 2", property_2_data);
      console.log("Combine data 3", property_3_data);
  
      property_1_data.forEach(function (record_p1) {
        var result_p2 = property_2_data.filter(function (record_p2) {
          return record_p1.property_year === record_p2.property_year;
        });
  
        var result_p3 = property_3_data.filter(function (record_p3) {
          return record_p1.property_year === record_p3.property_year;
        });
  
        delete record_p1.property_type;
        record_p1[property_list[0]] = record_p1.property_value;
        delete record_p1.property_value;
        record_p1[property_list[1]] =
          result_p2[0] !== undefined ? result_p2[0].property_value : null;
        record_p1[property_list[2]] =
          result_p3[0] !== undefined ? result_p3[0].property_value : null;
      });
      return property_1_data;
    });
  
    console.log("Final Combined Data Per Country", final_data);
    return final_data;
  }
  
  function combinedPropertyStatsPerYear(year) {
    property_list = ["population", "fertility_rate", "life_expectancy"];
  
    final_data = Promise.all([
      propertyStatsPerYear(property_list[0], year),
      propertyStatsPerYear(property_list[1], year),
      propertyStatsPerYear(property_list[2], year),
    ]).then(function (loadData) {
      property_1_data = loadData[0];
      property_2_data = loadData[1];
      property_3_data = loadData[2];
  
      console.log("Combine data 1", property_1_data);
      console.log("Combine data 2", property_2_data);
      console.log("Combine data 3", property_3_data);
  
      property_1_data.forEach(function (record_p1) {
        var result_p2 = property_2_data.filter(function (record_p2) {
          return record_p1.country_code === record_p2.country_code;
        });
  
        var result_p3 = property_3_data.filter(function (record_p3) {
          return record_p1.country_code === record_p3.country_code;
        });
  
        delete record_p1.property_type;
        record_p1[property_list[0]] = record_p1.property_value;
        delete record_p1.property_value;
        record_p1[property_list[1]] =
          result_p2[0] !== undefined ? result_p2[0].property_value : null;
        record_p1[property_list[2]] =
          result_p3[0] !== undefined ? result_p3[0].property_value : null;
      });
      return property_1_data;
    });
  
    console.log("Final Combined Data Per Year", final_data);
    return final_data;
  }
  
  function headerStats(country_code, year) {
    property_list = ["population", "fertility_rate", "life_expectancy"];
  
    current_year = +year;
    year_minus_1 = +year - 1;
    year_minus_10 = +year - 10;
  
    final_data = Promise.all([
      combinedPropertyStatsPerYearPerCountry(current_year, country_code),
    ]).then(function (loadData) {
      property_currentyear_data = loadData[0];
  
      var jsonData = {};
      var jsonDataFinal = {};
  
      jsonData["country_code"] = country_code;
  
      //Get current year stats
      var property_1_T0 = property_list[0] + "_" + current_year;
      var property_2_T0 = property_list[1] + "_" + current_year;
      var property_3_T0 = property_list[2] + "_" + current_year;
      jsonData[property_1_T0] = property_currentyear_data[property_list[0]];
      jsonData[property_2_T0] = property_currentyear_data[property_list[1]];
      jsonData[property_3_T0] = property_currentyear_data[property_list[2]];
  
      jsonDataFinal["country_code"] = jsonData["country_code"];
      jsonDataFinal["country_name"] = jsonData["country_name"];
  
      jsonDataFinal["current_population"] = jsonData[property_1_T0];
  
      jsonDataFinal["current_fertility_rate"] = jsonData[property_2_T0];
  
      jsonDataFinal["current_life_expectancy"] = jsonData[property_3_T0];
  
      console.log("Final Header stats Data:", jsonDataFinal);
      return jsonDataFinal;
    });
    return final_data;
  }
  
  function combinedPropertyStatsPerYearWithMetadataLookup(year) {
    property_list = ["population", "fertility_rate", "life_expectancy"];
  
    final_data = Promise.all([
      propertyStatsPerYear(property_list[0], year),
      propertyStatsPerYear(property_list[1], year),
      propertyStatsPerYear(property_list[2], year),
      lookupCountryMetadata("ALL"),
    ]).then(function (loadData) {
      property_1_data = loadData[0];
      property_2_data = loadData[1];
      property_3_data = loadData[2];
      property_meta_data = loadData[3];
  
      console.log("Combine data 1", property_1_data);
      console.log("Combine data 2", property_2_data);
      console.log("Combine data 3", property_3_data);
      console.log("Combine data 4", property_meta_data);
  
      property_1_data.forEach(function (record_p1) {
        var result_p2 = property_2_data.filter(function (record_p2) {
          return record_p1.country_code === record_p2.country_code;
        });
  
        var result_p3 = property_3_data.filter(function (record_p3) {
          return record_p1.country_code === record_p3.country_code;
        });
  
        var result_metadata = property_meta_data.filter(function (record_p4) {
          return record_p1.country_code === record_p4.country_code;
        });
  
        delete record_p1.property_type;
        record_p1[property_list[0]] = record_p1.property_value;
        delete record_p1.property_value;
        record_p1[property_list[1]] =
          result_p2[0] !== undefined ? result_p2[0].property_value : null;
        record_p1[property_list[2]] =
          result_p3[0] !== undefined ? result_p3[0].property_value : null;
  
        //Insert Metadata
        record_p1["income_grp_key"] =
          result_metadata[0] !== undefined
            ? result_metadata[0].income_grp_key
            : null;
        record_p1["income_grp_name"] =
          result_metadata[0] !== undefined
            ? result_metadata[0].income_grp_name
            : null;
        record_p1["region"] =
          result_metadata[0] !== undefined ? result_metadata[0].region : null;
      });
      return property_1_data;
    });
  
    console.log("Final Combined Data Per Year", final_data);
    return final_data;
  }
  