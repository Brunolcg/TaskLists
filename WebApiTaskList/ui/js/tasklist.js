angular.module('taskApp', [])
  .controller('TaskListController', function($scope, $http) {
    
	var TaskList = this;

    TaskList.tasks = [];

	$http({
        method : "GET",
        url: "../../tasklist"
    }).then(function mySuccess(response) {
        if (response.data) {
            response.data.forEach(function (result) {
                TaskList.tasks.push({
                    id: result.id,
                    text: result.title,
                    done: result.status,
                    createDate: formatDate(new Date(result.createDate)),
                    lastUpdate: formatDate(new Date(result.lastUpdate)),
                    status: (result.status ? 'done' : 'pending'),
                    classStatus: (result.status ? 'label-success' : 'label-warning'),
                    description: result.description
                })
            })
        }
    }, function myError(response) {
        alert('erro');
    });
	
    TaskList.addTask = function() {
      
	  if(TaskList.id) {
		  angular.forEach(TaskList.tasks, function(task, index) {
              if (task.id == TaskList.id) {
                  $http({
                      method: "POST",
                      url: "../../tasklist",
                      data: {
                          id: task.id,
                          title: TaskList.taskText,
                          description: TaskList.description,
                          createDate: new Date(),
                          lastUpdate: new Date(),
                          status: false
                      }
                  }).then(function mySuccess(response) {
                      TaskList.tasks[index].text = response.data.title;
                      TaskList.tasks[index].description = response.data.description;
                      TaskList.tasks[index].lastUpdate = formatDate(new Date());
                  }, function myError(response) {
                      alert(JSON.stringify(response));
                  });
			}
		  });
      } else {
          
        $http({
            method : "POST",
            url: "../../tasklist",
            data: {
                title: TaskList.taskText,
                description: TaskList.description,
                createDate: new Date(),
                lastUpdate: new Date(),
                status: false
            } 
        }).then(function mySuccess(response) {
            TaskList.tasks.push({
                id: response.data.id,
                text: response.data.title,
                description: response.data.description,
                done: false,
                createDate: formatDate(new Date()),
                lastUpdate: formatDate(new Date()),
                status: 'pending',
                classStatus: 'label-warning'
            });
        }, function myError(response) {
            alert(JSON.stringify(response));
        });
	        

        }
	  
	  TaskList.taskText = '';
	  TaskList.description = '';
	  TaskList.id = '';
    };
 
    TaskList.remaining = function() {
      var count = 0;
      angular.forEach(TaskList.tasks, function(task) {
        count += task.done ? 0 : 1;
      });
      return count;
    };
	
	TaskList.delete = function(obj){

        $http({
            method: "DELETE",
            url: "../../tasklist/" + obj.id
        }).then(function mySuccess(response) {
            angular.forEach(TaskList.tasks, function (task, index) {
                if (task.id == response.data.id) {
                    TaskList.tasks.splice(index, 1);
                }
            });

        }, function myError(response) {
            alert(JSON.stringify(response));
        });
	}
	
	TaskList.edit = function(obj){		
		TaskList.id = obj.id;
		TaskList.taskText = obj.text;
		TaskList.description = obj.description;
	}
	
	function formatDate(_date) {
		return (_date.getDate() < 10 ? '0': '')+_date.getDate()+'/'+(_date.getMonth() < 10 ? '0': '')+(_date.getMonth()+1)+'/'+_date.getFullYear()
	}

    function parseDate(_dateString) {
        return new Date(Number(_dateString.substr(6, 4)), Number(_dateString.substr(3, 2)) - 1, Number(_dateString.substr(0, 2)))
    }

	TaskList.doneTask = function (obj){
        $http({
            method: "POST",
            url: "../../tasklist",
            data: {
                id: obj.id,
                title: obj.text,
                description: obj.description,
                createDate: parseDate(obj.createDate),
                lastUpdate: parseDate(obj.lastUpdate),
                status: obj.done
            }
        }).then(function mySuccess(response) {
            if (obj.done) {
                obj.status = 'done';
                obj.classStatus = 'label-success';
            } else {
                obj.status = 'pending';
                obj.classStatus = 'label-warning';
            }
        }, function myError(response) {
            alert(JSON.stringify(response));
        });
        
        
	}
	
  });