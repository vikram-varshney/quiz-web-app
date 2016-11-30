var app=angular.module('quizApp',['ngStorage']);

/*------------------------Controller for Admin--------------------------------*/
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
	//$scope.questionList=[];
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
	});
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


/*-----------------------------Controller for User View-----------------------------*/
/*
 * Created by @Vikram on Monday, 28 November 2016 10:30 AM
 * Control the user view quiz 
 */

 app.controller('controlUser',['$scope','$localStorage',function($scope,$localStorage){
 	/*-------------------------Initialize variables----------------------------*/

 	$scope.quesData=$localStorage.questionList;	//copy the questionList into local variable quesData
 	$scope.index=0;
 	$scope.scoreCounter=0;
 	$scope.isScore=false;
 	$scope.scoreMessage='';
 	$scope.userAnswer=[];

 	/*--------Making the array of objects that binds the user answers---------*/
 	angular.forEach($scope.quesData,function(ques,index){
 		var tempAnswers=[];
 		angular.forEach(ques.answers,function(ans,ind){
 				tempAnswers[ind]={
 					answer:ans.answer,
 					res:false
 				}
 			});
 		$scope.userAnswer[index]={
 			qid:ques.qid,
 			answers: tempAnswers ,
 			resultR:0
 		};
 	});

 	/*---------------Function that check the question type--------------*/
 	$scope.checkQuestionType=function(qType){
 		if(qType==='Singlepunch'){
 			return true;
 		}else{
 			return false;
 		}
 	}

 	/*-------------------Previous click logic to reduce the index value by 1--------------*/
 	$scope.previous=function(index){
 		$scope.index = index > 0 ? index-1 : 0;

 	}

 	/*--------------------Next click logic to add the index value by 1------------------*/
 	$scope.next=function(index){
 		$scope.index = index < $scope.quesData.length-1 ? index + 1 : $scope.quesData.length-1;
 	}

 	/*------------------Function that calculate the score according to user answers----------*/
 	$scope.calculateScore=function(){
 		
 		angular.forEach($scope.quesData,function(ques,index){
 			if(ques.resultR!=null && ques.questionType==='Singlepunch'){
 				if(ques.qid===$scope.userAnswer[index].qid && ques.resultR===$scope.userAnswer[index].resultR){
 					$scope.scoreCounter++;
 				}
 			}
 			if(ques.questionType==='Multipunch'){
 				var tempCounter=0;
 				angular.forEach(ques.answers,function(ans,ind){
 					if (ans.res===$scope.userAnswer[index].answers[ind].res)
 					{
 						tempCounter++;
 					}
 				});		
 				if(tempCounter===ques.answers.length){
 					$scope.scoreCounter++;
 				}
 			}

 		});
 		$scope.isScore=true;
	 	if($scope.scoreCounter>=0 && $scope.scoreCounter<($scope.quesData.length/2)){
	 		$scope.scoreMessage='You need to do work hard!';
	 	}else if($scope.scoreCounter>=($scope.quesData.length/2) && $scope.scoreCounter<($scope.quesData.length*0.9)){
	 		$scope.scoreMessage='Well done!';
	 	}else if($scope.scoreCounter>=($scope.quesData.length*0.9) && $scope.scoreCounter==$scope.quesData.length){
	 		$scope.scoreMessage='Excellent!';
 		}
 	}
 	
 	$scope.showUserAns=function(id){
 		var arr=[];
 			arr=id.answers.filter(function(ans,ind){
 				if(ans.res){
 					return ans;
 				}
 			});
 			if(id.resultR==0 && arr.length==0){
 				return ;
 			}
 		else if(id.resultR==0 && arr.length>0){
 			var temp=[];
 			angular.forEach(arr,function(ans,ind){
 				temp.push(ans.answer);
 			});
 			return temp.join('|');
 		}else{

 			return id.resultR;
 		}
 	}
 }]);