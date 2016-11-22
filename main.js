var app=angular.module('quizApp',[]);
app.controller('controlQuiz',['$scope',function($scope){
	/*------------------Initialize variables---------------*/
	var tempUpdateAns=0;
	$scope.qid=1;
	$scope.newQuestionShow=false;
	$scope.edit=false;
	$scope.answerType='radio';
	$scope.resultType=true;
	$scope.errorAnsShow=false;
	$scope.errorSameAnswer='';
	$scope.answerList=[];
	$scope.questionList=[];
	$scope.result=$scope.answerList[0];


	/*------------------Function that adds the answer into answerList--------------*/

	$scope.addAnswer=function(){
		var answerCount=0;
		for(var i=0;i<$scope.answerList.length;i++){
			if($scope.answerList[i].answer===$scope.answer){
				answerCount++;
			}
		}
		if(answerCount==0){
			$scope.errorAnsShow=false;
			$scope.answerList.push(
			{ 
				answer: $scope.answer,
				res:false,
			});
		}else{
			$scope.errorAnsShow=true;
			$scope.errorSameAnswer="Answer is already in answer(s) list.";
		}
		$scope.answer='';
	};

	/*-------------------Function that takes the answer for edit----------------*/
	$scope.editAns=function(index){
		$scope.edit=true;
		$scope.answer=$scope.answerList[index].answer;
		setEditableAns(index); //call function for set the updating value into temp variable

	};
	/*-----------------Accessor for updating answer value----------------*/
	function setEditableAns(index){
		tempUpdateAns=index;
	}
	function getEditableAns(){
		return tempUpdateAns;
	}

	/*-----------------Updating the answer into answer list-------------*/
	$scope.update=function(){
		var answerCount=0;
		angular.forEach($scope.answerList,function(ans,index){
			if(ans.answer===$scope.answer){
				answerCount++;
			}
		});
		if(answerCount==0){
			$scope.errorAnsShow=false;
			$scope.answerList[getEditableAns()].answer=$scope.answer;
			$scope.edit=false;
			
		}else if(answerCount==1 && $scope.answerList[getEditableAns()].answer===$scope.answer){
			$scope.errorAnsShow=false;
			$scope.edit=false;
			
		}else{
			$scope.errorAnsShow=true;
			$scope.errorSameAnswer="Answer is already in answer(s) list.";
		}
			$scope.answer='';
	}

	/*--------------------function that delete the answer into answer list-----------------*/
	$scope.deleteAns=function(index){
			$scope.result=null;
		$scope.answerList.splice(index,1);

	};

	
	/*---------------------Check the answer type to set the result with single or multi-------------*/
	$scope.selectAnswerType=function(answerTypeValue){
		if(answerTypeValue==='radio'){
			$scope.resultType=true;
			angular.forEach($scope.answerList,function(ans,index){
				ans.res=false;
			});
		}else{
			$scope.resultType=false;
			$scope.result=null;
		}
	}

	/*---------------Add the result of multi punch into an array-----------------*/	
	$scope.checkedResultAnswer=function(){
		var resultList=[];
		angular.forEach($scope.answerList,function(ans,index){
			if(ans.res){
				resultList.push(index+1);
			}
	})
	return resultList;
}

/*------------------Function that add questions into JSON format-------------------*/
$scope.addQuestion=function(){

	$scope.questionList.push({
		qid:$scope.qid,
		question:$scope.question,
		answerType:$scope.answerType,
		answers:$scope.answerList,
		resultR:$scope.result,
		resultC:$scope.checkedResultAnswer()
	});
	$scope.qid++;
	$scope.reset();
}

$scope.reset=function(){
	$scope.newQuestionShow=false;
	$scope.question='';
	$scope.answerType='radio';
	$scope.resultType=true;
	$scope.answerList=[];
	$scope.result=null;

}

}]);