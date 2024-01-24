using System.ComponentModel.DataAnnotations;

namespace IdentityService;

public class RegisterViewModel
{
    [Required]
    public string Password {get; set;}
    [Required]
    public string Login {get; set;}
    [Required]
    public string FullName {get; set;}
    public string ReturnUrl {get; set;}
    public string Button {get; set;}
}
