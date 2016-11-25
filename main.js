var app=angular.module('quizApp',['ngStorage']);
app.controller('controlQuiz',['$scope','$localStorage','$sessionStorage',function($scope,$localStorage,$sessionStorage){
	/*------------------Initialize variables---------------*/
	$scope.$storage=$localStorage.$default({
		countQid:1,
		questionList:[]
	});
	
	$scope.qid=$localStorage.countQid;
	$scope.newQuestionShow=false;
	$scope.edit=false;
	$scope.questionType='Singlepunch';
	$scope.resultType=true;
	$scope.errorAnsShow=false;
	$scope.errorSameAnswer='';
	$scope.errorResult='';
	$scope.errorResultShow=false;
	$scope.answerList=[];
	$scope.questionList=[];
	$scope.result=$scope.answerList[0];
	$scope.selectedAns=undefined;
	$scope.isEditQues=false;
	$scope.editQuesObject={};
	$scope.errorNotEmptyShow=false;
	$scope.errorNotEmpty='';


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
				editAnsClick:false
			});
		}else{
			$scope.errorAnsShow=true;
			$scope.errorSameAnswer="*Answer is already in answer(s) list.";
		}
		$scope.answer='';
	};

	/*-------------------Function that takes the answer for edit----------------*/
	$scope.editAns=function(index){
		$scope.selectedAns=index;
		$scope.answerList[index].editAnsClick=true;
	};
	
	/*-----------------Updating the answer into answer list-------------*/
	$scope.update=function(index,ansr){
		var answerCount=0;
			$scope.answerList[index].answer=ansr;
			
			angular.forEach($scope.answerList,function(ans,index){
				if(ans.answer===ansr){
					answerCount++;
				}
			});
			if(answerCount==1){
				$scope.errorAnsShow=false;
				$scope.answerList[index].editAnsClick=false;
				$scope.selectedAns=undefined;
			}else{
				$scope.errorAnsShow=true;
				$scope.answerList[index].editAnsClick=true;
				$scope.errorSameAnswer="*Answer is already in answer(s) list.";
			}
		
		
	}

	/*--------------------function that delete the answer into answer list-----------------*/
	$scope.deleteAns=function(index){
			$scope.result=null;
		$scope.answerList.splice(index,1);

	};

	
	/*---------------------Check the answer type to set the result with single or multi-------------*/
	$scope.selectQuestionType=function(questionTypeValue){
		if(questionTypeValue==='Singlepunch'){
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
	var ansValue=$scope.answerList.filter(function(ans,index){
		if(ans.answer==null){
			return ans;
		}
	});
	if(ansValue.length>0){
		$scope.errorNotEmptyShow=true;
		$scope.errorNotEmpty='*Answer List should not be empty';
	}
	else if($scope.result!=null || $scope.checkedResultAnswer().length>0){
		$localStorage.questionList.push({
			qid:$scope.qid,
			question:$scope.question,
			questionType:$scope.questionType,
			answers:$scope.answerList,
			resultR:$scope.result,
			resultC:$scope.checkedResultAnswer()
		});
		
		$scope.qid=$localStorage.countQid++;
		$scope.reset();
	}else{
		$scope.errorResultShow=true;
		$scope.errorResult='*Must select result';
		$scope.errorNotEmptyShow=false;
	}
	
}

/*-------------------------Function that reset all variables------------------*/
$scope.reset=function(){
	$scope.newQuestionShow=false;
	$scope.isEditQues=false;
	$scope.qid=$localStorage.countQid;
	$scope.question='';
	$scope.questionType='Singlepunch';
	$scope.resultType=true;
	$scope.answerList=[];
	$scope.result=null;
	$scope.editQuesObject={};
	$scope.errorSameAnswer='';
	$scope.errorResult='';
	$scope.errorResultShow=false;
	$scope.errorNotEmptyShow=false;
	$scope.errorNotEmpty='';
}

$scope.getResult=function(resultR,resultC){
	if(resultR===null){
		return resultC;
	}else{
		return resultR;
	}
}

/*---------------------------Delete the question from question list-------------------*/

$scope.deleteQues=function(index){
	$localStorage.questionList.splice(index,1);
}

/*-------------------------Edit question from the question list---------------------*/

$scope.editQues=function(obj){
	$scope.isEditQues=true;
	$scope.newQuestionShow=true;
	$scope.editQuesObject=obj;
	$scope.qid=obj.qid;
	$scope.question=obj.question;
	$scope.questionType=obj.questionType;
	$scope.answerList=angular.copy(obj.answers);
	if(obj.resultR===null){
		angular.forEach(obj.answers,function(ans,index){
			$scope.answerList[index].res=ans.res;
		});
		$scope.resultType=false;
		$scope.result=null;
	}else{
		$scope.result=obj.resultR;
		$scope.resultType=true;
	}

}

/*------------------------Update question according to qid-----------------------*/

$scope.updateQuestion=function(id){
	var ansValue=$scope.answerList.filter(function(ans,index){
		if(ans.answer==null){
			return ans;
		}
	});
	if(ansValue.length>0){
		$scope.errorNotEmptyShow=true;
		$scope.errorNotEmpty='*Answer List should not be empty';
	}
	else if($scope.result!=null || $scope.checkedResultAnswer().length>0 ){
		if($scope.editQuesObject.qid===id){
		$scope.editQuesObject.question=$scope.question;
		$scope.editQuesObject.questionType=$scope.questionType;
		$scope.editQuesObject.answers=$scope.answerList;
		$scope.editQuesObject.resultR=$scope.result;
		$scope.editQuesObject.resultC=$scope.checkedResultAnswer();
	}
	$scope.reset();
	}
	else{
		$scope.errorResultShow=true;
		$scope.errorNotEmptyShow=false;
		$scope.errorResult='*Must select result';
	}	
}

/*------------------------Disable delete button while updating the question--------------*/
$scope.disableDelete=function(obj){
	if($scope.editQuesObject.qid===obj.qid){
		return true;
	}else{
		return false;
	}
}
}]);