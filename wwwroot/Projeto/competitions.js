// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/competitions');
    //self.baseUri = ko.observable('http://localhost:62595/api/drivers');
    self.displayName = 'Olympic Games Competitions List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.modalities = ko.observableArray([]);
    self.records = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(20);
    self.totalRecords = ko.observable(50);
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);
    self.previousPage = ko.computed(function () {
        return self.currentPage() * 1 - 1;
    }, self);
    self.nextPage = ko.computed(function () {
        return self.currentPage() * 1 + 1;
    }, self);
    self.fromRecord = ko.computed(function () {
        return self.previousPage() * self.pagesize() + 1;
    }, self);
    self.toRecord = ko.computed(function () {
        return Math.min(self.currentPage() * self.pagesize(), self.totalRecords());
    }, self);
    self.totalPages = ko.observable(0);
    self.pageArray = function () {
        var list = [];
        var size = Math.min(self.totalPages(), 9);
        var step;
        if (size < 9 || self.currentPage() === 1)
            step = 0;
        else if (self.currentPage() >= self.totalPages() - 4)
            step = self.totalPages() - 9;
        else
            step = Math.max(self.currentPage() - 5, 0);

        for (var i = 1; i <= size; i++)
            list.push(i + step);
        return list;
    };

    self.selectedCompetition = ko.observable({});
    self.participants = ko.observableArray([]);
    self.selectedGame = ko.observable({});
    self.athletes = ko.observableArray([]);
    self.modalities = ko.observableArray([]);
    self.medals = ko.observableArray([]);
    self.selectedAthlete = ko.observable({});
    self.Born = ko.observable('');
    self.Died = ko.observable('');
    self.games = ko.observableArray([]);


    //--- Page Events
    self.activate = function (id) {
        
        $('#search-bar').autocomplete({
            source: function(request, response) {
              $.ajax({
                url: `http://192.168.160.58/Olympics/api/competitions/SearchByName?q=${request.term}`,
                type: "GET",
                success: function(data) {
                    var labels = data.map(function(item){return item.Name});
                    response(labels);
                }
              });
            }
        });

        if ($("#search-bar").val().length == 0){
            console.log('CALL: getCompetitions...');
            var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
            ajaxHelper(composedUri, 'GET').done(function (data) {
                console.log(data);
                hideLoading();
                self.currentPage(data.CurrentPage);
                self.hasNext(data.HasNext);
                self.hasPrevious(data.HasPrevious);
                self.records(data.Records);
                self.pagesize(data.PageSize)
                self.totalPages(data.TotalPages);
                self.totalRecords(data.TotalRecords);
                //self.SetFavourites();

                // Iterate through the records
                self.records().forEach(function(record) {
                    // Check if a modality with the same name already exists in the array
                    var modality = self.modalities().find(function(modality) {
                      return modality.name === record.Modality;
                    });
                    // If the modality doesn't exist, create a new object for it
                    if (!modality) {
                      modality = { name: record.Modality, competitions: [] };
                      self.modalities().push(modality);
                    }
                    // Add the competition to the modality's array
                    modality.competitions.push(record);
                });

                self.modalities(self.modalities());

                $('.competition').click(function() {
                    // Get the competition id from the data attribute
                    var competitionId = $(this).data('competition-id');
                    ajaxHelper(`http://192.168.160.58/Olympics/api/competitions/${competitionId}`, "GET").done(function(data) {
                        self.selectedCompetition(data);
                        self.participants(data.Participant);

                        $(".modal").modal("hide");
                        $("#competitionsModal").modal("show");
                    });
                });
            });
        }

        $('#search-button').click(function() {
            // Get the search query from the search bar
            var query = $('#search-bar').val();
            console.log(query);

            if (query.length == 0){
                console.log('CALL: getCompetitions...');
                var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
                ajaxHelper(composedUri, 'GET').done(function (data) {
                    console.log(data);
                    hideLoading();
                    self.currentPage(data.CurrentPage);
                    self.hasNext(data.HasNext);
                    self.hasPrevious(data.HasPrevious);
                    self.records(data.Records);
                    self.pagesize(data.PageSize)
                    self.totalPages(data.TotalPages);
                    self.totalRecords(data.TotalRecords);
                    //self.SetFavourites();

                    // Iterate through the records
                    self.records().forEach(function(record) {
                        // Check if a modality with the same name already exists in the array
                        var modality = self.modalities().find(function(modality) {
                          return modality.name === record.Modality;
                        });
                        // If the modality doesn't exist, create a new object for it
                        if (!modality) {
                          modality = { name: record.Modality, competitions: [] };
                          self.modalities().push(modality);
                        }
                        // Add the competition to the modality's array
                        modality.competitions.push(record);
                    });

                    self.modalities(self.modalities());

                    $('.competition').click(function() {
                        // Get the competition id from the data attribute
                        var competitionId = $(this).data('competition-id');
                        ajaxHelper(`http://192.168.160.58/Olympics/api/competitions/${competitionId}`, "GET").done(function(data) {
                            self.selectedCompetition(data);
                            self.participants(data.Participant);

                            $(".modal").modal("hide");
                            $("#competitionsModal").modal("show");
                        });
                    });
                });
            } else {
                // Make an AJAX call to the API with the search query
                $.ajax({
                    url: `http://192.168.160.58/Olympics/api/competitions/SearchByName?q=${query}`,
                    type: "GET",
                    success: function(data) {
                      // Clear the search results div
                        $('#competitions-container').html('');

                        console.log(data);
                    
                        self.currentPage(1);
                        self.hasNext(false);
                        self.hasPrevious(false);
                        self.records(data);
                        self.pagesize(data.length)
                        self.totalPages(1);
                        self.totalRecords(data.length);
                        //self.SetFavourites();
                        self.modalities([]);
                        // Iterate through the records
                        self.records().forEach(function(record) {
                            // Check if a modality with the same name already exists in the array
                            var modality = self.modalities().find(function(modality) {
                              return modality.name === record.Modality;
                            });
                            // If the modality doesn't exist, create a new object for it
                            if (!modality) {
                              modality = { name: record.Modality, competitions: [] };
                              self.modalities().push(modality);
                            }
                            // Add the competition to the modality's array
                            modality.competitions.push(record);
                        });


                        self.modalities(self.modalities());

                        $('.competition').click(function() {
                            // Get the competition id from the data attribute
                            var competitionId = $(this).data('competition-id');
                            ajaxHelper(`http://192.168.160.58/Olympics/api/competitions/${competitionId}`, "GET").done(function(data) {
                                self.selectedCompetition(data);
                                self.participants(data.Participant);

                                $(".modal").modal("hide");
                                $("#competitionsModal").modal("show");
                            });
                        });
                    
                    }
                });
            };
        });

    };

    self.showGameDetails = function(game){
        var i = 20
        ajaxHelper(`http://192.168.160.58/Olympics/api/games/FullDetails?id=${game.Id}`, "GET").done(function(data){
            self.selectedGame(data);
            self.athletes(data.Athletes.slice(0, i));
            self.medals(data.Medals);

            data.Competitions.forEach(function(record) {
                // Check if a modality with the same name already exists in the array
                var modality = self.modalities().find(function(modality) {
                    return modality.name === record.Modality;
                });
                // If the modality doesn't exist, create a new object for it
                if (!modality) {
                    modality = { name: record.Modality, competitions: [] };
                    self.modalities().push(modality);
                };
                // Add the competition to the modality's array
                modality.competitions.push(record);
            });
            self.modalities(self.modalities());

            console.log(data);
            $(".modal").modal("hide");
            $("#gamesModal").modal("show");

            $("#viewmore_athletes").click(function(){
                i = i + 20
                self.athletes(data.Athletes.slice(0, i));
            });
        });
    };

    self.showAthleteDetails = function(athlete) {

        ajaxHelper(`http://192.168.160.58/Olympics/api/Athletes/FullDetails?id=${athlete.Id}`, "GET").done(function(data){
            self.selectedAthlete(data);

            if (data.BornDate == null){
                self.Born("null / " + data.BornPlace);
            } else {
                self.Born(data.BornDate.slice(0, 10) + " / " + data.BornPlace);
            };


            if (data.DiedDate == null) {
                self.Died("null / " + data.DiedPlace);
            } else {
                self.Died(data.DiedDate.slice(0, 10) + " / " + data.DiedPlace);
            };
            
            self.games(data.Games);
            self.medals(data.Medals); 

            data.Competitions.forEach(function(record) {
                // Check if a modality with the same name already exists in the array
                var modality = self.modalities().find(function(modality) {
                    return modality.name === record.Modality;
                });
                // If the modality doesn't exist, create a new object for it
                if (!modality) {
                    modality = { name: record.Modality, competitions: [] };
                    self.modalities().push(modality);
                };
                // Add the competition to the modality's array
                modality.competitions.push(record);
            });
            self.modalities(self.modalities());

            console.log(data);
            $(".modal").modal("hide");
            $("#athletesModal").modal("show");
        });
    };



    //--- Internal functions
    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                hideLoading();
                self.error(errorThrown);
            }
        });
    }

    function sleep(milliseconds) {
        const start = Date.now();
        while (Date.now() - start < milliseconds);
    }

    function showLoading() {
        $("#myModal").modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }
    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        })
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
        console.log("sPageURL=", sPageURL);
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    //--- start ....
    showLoading();
    var pg = getUrlParameter('page');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})
