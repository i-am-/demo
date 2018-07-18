import org.apache.juli.logging.Log
import org.apache.juli.logging.LogFactory
import org.codehaus.groovy.runtime.InvokerHelper

class Debugger extends Script {
    // Script provides debugging facility
    // Reads all variables (disregarding scope) and dumps variable contents
    private Log log = LogFactory.getLog(Debugger.class);
    Binding binding = getBinding()

    def run() {
          def scope         = this.binding.getVariable("execution")
          Map<String,Object> variables = scope.getVariables()
          log.info('='.multiply(80))
          log.info ("*** " + (scope.getProcessBusinessKey() || "") + " *** " + scope.getCurrentActivityId() +": "+ scope.getCurrentActivityName())
          log.info ('===> Variables:')
          variables.each{
                String variableName = it.getKey()
                def variableObject  = it.getValue()
                String variableClassName = variableObject.getClass().getSimpleName()
                log.info ("> " + variableName + " ["+variableClassName+"]: " + variableObject.toString())
           }
          log.info('='.multiply(80))
      }
      static void main(String[] args) {
          InvokerHelper.runScript(Debugger, args)
      }
}
