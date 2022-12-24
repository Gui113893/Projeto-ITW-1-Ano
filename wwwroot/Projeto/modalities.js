// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/modalities');
    //self.baseUri = ko.observable('http://localhost:62595/api/drivers');
    self.displayName = 'Olympic Games Modalities List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
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
        return list
    };

    self.selectedModality = ko.observable({});
    self.competitions = ko.observableArray([]);

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getModalities...');
        var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.records(data.Records);
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize)
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalRecords);
            //self.SetFavourites();
        });
    };

    self.showModalityDetails = function(modality) {
        ajaxHelper(`http://192.168.160.58/Olympics/api/modalities/${modality.Id}`, "GET").done(function(data){
            self.selectedModality(data);
            self.competitions(data.Modalities);

            $("#modalitiesModal").modal("show");


            let chart;

            function generateChartData() {

                if (chart) {
                    chart.destroy();
                }

                // Generate chart data
                var data = self.competitions().map(function(competition) { return competition.Results; });
                var labels = self.competitions().map(function(competition) { return competition.Name; });

                // Chart options
                var options = {
                    scales: {
                        xAxes: [{
                          id: 'x-axis-0',
                          ticks: {
                            beginAtZero: true
                          }
                        }],
                        yAxes: [{
                          id: 'y-axis-0',
                          position: 'left',
                          // Set y-axis labels to be visible
                          scaleLabel: {
                            display: true
                          },
                          // Set y-axis label font size and color
                          ticks: {
                            fontSize: 14,
                            fontColor: '#000'
                          }
                        }]
                    }
                };

                // Initialize chart
                var ctx = document.getElementById('barChart').getContext('2d');
                chart = new Chart(ctx, {
                  type: 'horizontalBar',
                  data: {
                    labels: labels,
                    datasets: [{
                      label: 'Results',
                      data: data,
                      backgroundColor: '#2649c7',
                      xAxisID: "x-axis-0",
                      yAxisID: "y-axis-0"
                    }]
                  },
                  options: options
                });
            };
        
            $('#modalitiesModal').on('shown.bs.modal', function() {
                generateChartData();
            });
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

});